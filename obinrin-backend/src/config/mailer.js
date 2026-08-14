import nodemailer from "nodemailer";

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