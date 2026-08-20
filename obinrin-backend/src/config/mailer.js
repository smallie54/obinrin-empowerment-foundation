
const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set — cannot send email.");
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not set — cannot send email.");
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Resend's error responses include a helpful "message" field —
    // surface it directly instead of a generic failure.
    throw new Error(data.message || `Resend API error (${response.status})`);
  }

  console.log(`Email sent via Resend: ${data.id} to ${to}`);

  return data;
}

export default { sendEmail };