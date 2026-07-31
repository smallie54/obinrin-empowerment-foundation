import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text }) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM || "Obinrin Empowerment Foundation <onboarding@resend.dev>",
    to,
    subject,
    html: html || `<p>${text}</p>`,
    text: text || undefined,
  });
}

export default resend;