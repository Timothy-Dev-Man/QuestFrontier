import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
    const {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_USER,
        SMTP_PASS,
    } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        throw new Error("Missing SMTP environment variables.");
    }

    if (!transporter) {
        const port = Number(SMTP_PORT || 587);

        transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port,
            secure: port === 465,
            requireTLS: port === 587,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });
    }

    return transporter;
}

export async function sendPasswordResetEmail(to, code) {
    const emailTransporter = getTransporter();
    const emailFrom = process.env.EMAIL_FROM;

    if (!emailFrom) {
        throw new Error("Missing EMAIL_FROM environment variable.");
    }

    return emailTransporter.sendMail({
        from: `"System" <${emailFrom}>`,
        to,
        subject: "Reset your System password",
        text: `Your password reset code is ${code}.

This code expires in 10 minutes.

If you did not request a password reset, you can ignore this email.`,
        html: `
      <h2>Reset your System password</h2>
      <p>Use the following code to reset your password:</p>
      <h1>${code}</h1>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request a password reset, you can ignore this email.</p>
    `,
    });
}

export async function verifyEmailConnection() {
    await getTransporter().verify();
}