const nodemailer = require("nodemailer");

let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Sends a one-time password by email. If SMTP isn't configured (e.g. local
// development), it logs the OTP to the console instead of failing, so the
// reset flow stays testable without real mail credentials.
async function sendOtpEmail(toEmail, otp) {
  if (!transporter) {
    console.log(`[mailer] SMTP not configured - OTP for ${toEmail}: ${otp}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: "Your verification code",
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
  });
}

module.exports = { sendOtpEmail };
