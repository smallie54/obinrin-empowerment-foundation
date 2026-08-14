// config/mailer.js
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, text, html }) {
  try {
    if (!to || !subject) {
      throw new Error('Missing required fields: to or subject');
    }

    const emailContent = html || text;
    if (!emailContent) {
      throw new Error('Either html or text content is required');
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject: subject,
      html: html || text, // Resend prefers HTML
      text: text || undefined,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    console.log(`✅ Email sent: ${data.id} to ${to}`);
    return data;
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

export default resend;