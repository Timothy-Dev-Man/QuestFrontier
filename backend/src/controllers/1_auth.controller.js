// auth.controller.js
import { registerUser, loginUser, findUserByEmail } from "../services/1_auth.service.js"
import { changePassword } from "../services/4_user.service.js"
import { randomInt, createHmac, timingSafeEqual } from "node:crypto";
import { sendPasswordResetEmail } from "../utils/email.utils.js";
import pool from "../../DB/config/db.js";

export async function register(req, res) {
  // extract data from req.body, call auth.service.registerUser, send JSON response
  try {
    const { name, email, password } = req.body
    const user = await registerUser(name, email, password)
    res.status(200).json(user)
  } catch (err) {
    console.error("User registration failed", err)
    res.status(500).json({ message: err.message })
  }
}

export async function login(req, res) {
  // extract credentials from req.body, call auth.service.loginUser, send JSON response
  try {
    const { value, password } = req.body;

    const isEmail = value.includes("@");

    const email = isEmail ? value.trim().toLowerCase() : null;
    const name = isEmail ? null : value.trim().toLowerCase();


    const user = await loginUser({ email, name, password })
    console.info("User login succeeded")
    res.status(200).json(user)
  } catch (err) {
    console.warn("User login failed", err.message)
    res.status(401).json({ message: "Invalid email or password" })
  }
}

export async function checkUserExists(req, res) {
  try {
    const { email } = req.body
    const user = await findUserByEmail(email)
    if (!user) {
      res.status(404).json({ message: "No account found with that email" })
    }
    res.status(200).json(user)
  } catch (err) {
    console.warn("User login failed")
    res.status(401).json({ message: "Invalid email or password" })
  }
}

export async function forgotPassword(req, res) {
  const message = "If an account with that email exists, a reset code has been sent.";

  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  const found = await findUserByEmail(email)
  if (!found) {
    res.status(404).json({ message: "No account found with that email" })
  }

  console.log(`Email: ${email}, ${found}`)
  try {
    if (!process.env.RESET_CODE_PEPPER) {
      throw new Error("RESET_CODE_PEPPER is not configured.");
    }

    if (email) {
      const { rows } = await pool.query(
        `SELECT id, email
         FROM users
         WHERE LOWER(email) = $1
         LIMIT 1`,
        [email]
      );

      if (rows.length > 0) {
        const user = rows[0];
        const code = randomInt(100000, 1000000).toString();

        const codeHash = createHmac(
          "sha256",
          process.env.RESET_CODE_PEPPER
        )
          .update(`${user.id}:${code}`)
          .digest("hex");

        await pool.query(
          `INSERT INTO password_reset_codes
             (user_id, code_hash, expires_at, attempts, created_at)
           VALUES ($1, $2, NOW() + INTERVAL '10 minutes', 0, NOW())
           ON CONFLICT (user_id)
           DO UPDATE SET
             code_hash = EXCLUDED.code_hash,
             expires_at = EXCLUDED.expires_at,
             attempts = 0,
             created_at = NOW()`,
          [user.id, codeHash]
        );

        try {
          await sendPasswordResetEmail(user.email, code);
        } catch (emailError) {
          console.error(
            "Password reset email failed:",
            emailError.message
          );

          await pool.query(
            "DELETE FROM password_reset_codes WHERE user_id = $1",
            [user.id]
          );
        }
      }
    }
    console.log("MESSAGE: ", message)
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      message: "Unable to process your request right now.",
    });
  }
}

export async function verifyPasswordResetCode(req, res) {
  const invalidMessage = "Invalid or expired reset code.";

  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  const code =
    typeof req.body?.code === "string"
      ? req.body.code.trim()
      : "";

  console.log("VERIFY: ", email, code)

  if (!email || !/^\d{6}$/.test(code)) {
    return res.status(400).json({
      message: invalidMessage,
    });
  }

  try {
    if (!process.env.RESET_CODE_PEPPER) {
      throw new Error("RESET_CODE_PEPPER is not configured.");
    }

    const { rows } = await pool.query(
      `SELECT
         u.id AS user_id,
         prc.code_hash,
         prc.expires_at,
         prc.attempts
       FROM users u
       JOIN password_reset_codes prc
         ON prc.user_id = u.id
       WHERE LOWER(u.email) = $1
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: invalidMessage,
      });
    }

    const reset = rows[0];

    if (
      reset.attempts >= 5 ||
      new Date(reset.expires_at).getTime() <= Date.now()
    ) {
      if (new Date(reset.expires_at).getTime() <= Date.now()) {
        await pool.query(
          "DELETE FROM password_reset_codes WHERE user_id = $1",
          [reset.user_id]
        );
      }

      return res.status(400).json({
        message: invalidMessage,
      });
    }

    const submittedHash = createHmac(
      "sha256",
      process.env.RESET_CODE_PEPPER
    )
      .update(`${reset.user_id}:${code}`)
      .digest("hex");

    const storedBuffer = Buffer.from(
      String(reset.code_hash).trim(),
      "hex"
    );

    const submittedBuffer = Buffer.from(submittedHash, "hex");

    const matches =
      storedBuffer.length === submittedBuffer.length &&
      timingSafeEqual(storedBuffer, submittedBuffer);

    if (!matches) {
      await pool.query(
        `UPDATE password_reset_codes
         SET attempts = LEAST(attempts + 1, 5)
         WHERE user_id = $1`,
        [reset.user_id]
      );

      return res.status(400).json({
        message: invalidMessage,
      });
    }

    return res.status(200).json({
      valid: true,
      message: "Reset code verified.",
    });
  } catch (error) {
    console.error("Verify reset code error:", error.message);

    return res.status(500).json({
      message: "Unable to verify the reset code right now.",
    });
  }
}

export async function resetPassword(req, res) {

  try {
    const { password, userId } = req.body
    console.log("password, ", password, " for user id: ", userId)
    const result = await changePassword(password, userId)
    res.status(201).json(result)
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      message: "Unable to process your request right now.",
    });
  }
}
