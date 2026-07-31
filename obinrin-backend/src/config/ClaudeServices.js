// services/claudeService.js
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

export async function generateThankYouDraft({ donorName, amount, currency, channel }) {
  const amountText = amount ? `${currency || "₦"}${amount}` : "their generous gift";

  const lengthInstruction =
    channel === "sms"
      ? "Keep it under 300 characters total, suitable for a text message — no greeting formalities, just warm and brief."
      : "Write 3-4 short paragraphs suitable for an email, with a greeting and sign-off.";

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `Write a warm thank-you message from Obinrin Empowerment Foundation to a donor named "${donorName}" who gave ${amountText}. Mention that their gift helps provide education, mentorship, and sanitary supplies to girls. ${lengthInstruction} Sign off as "The Obinrin Empowerment Foundation Team" (only for email, not SMS). Do not include a subject line. Return only the message body, nothing else.`,
      },
    ],
  });

  return message.content[0].text.trim();
}