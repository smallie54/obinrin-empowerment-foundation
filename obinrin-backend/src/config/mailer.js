import nodemailer from "nodemailer";

// secure must be true for port 465 (implicit TLS) and false for port 587
// (STARTTLS). Hardcoding this wrong is a common cause of emails that
// appear to "send" successfully but never actually arrive.
const port = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("SMTP connection failed at startup:", err.message);
  } else {
    console.log("SMTP connection verified — ready to send email.");
  }
});

export async function sendEmail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  console.log(`Email sent: ${info.messageId} to ${to}`);

  return info;
}

export default transporter;