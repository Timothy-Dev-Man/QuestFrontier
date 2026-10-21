import morgan from "morgan"
import { verifyJWT } from "../services/1_auth.service.js"
import pool from "../../DB/config/db.js"


export async function authenticate(req, res, next) {

  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.query.token

  if (!token || token === "null" || token === "undefined") {
    console.warn("Authentication failed: token missing")
    return res.status(401).send("Access denied. No valid token provided.")
  }

  try {

    // Check whether token has been logged out
    const revoked = await pool.query(
      "SELECT id FROM revoked_tokens WHERE token = $1",
      [token]
    )

    if (revoked.rows.length > 0) {
      console.warn("Authentication failed: token revoked")
      return res
        .status(401)
        .send("Token has been revoked.")
    }

    // Verify JWT
    const decoded = verifyJWT(token)

    req.user = decoded

    next()

  } catch (err) {

    console.warn("Authentication failed: token invalid")

    return res
      .status(401)
      .send("Invalid token")
  }
}

export function getServerLoggerMiddleware() {
  return morgan(":method :status :response-time ms")
}