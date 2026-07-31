// services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

export async function generateThankYouDraft({ donorName, amount, currency, channel }) {
  const amountText = amount ? `${currency || "₦"}${amount}` : "their generous gift";

  const lengthInstruction =
    channel === "sms"
      ? "Keep it under 300 characters total, suitable for a text message — no greeting formalities, just warm and brief."
      : "Write 3-4 short paragraphs suitable for an email, with a greeting and sign-off.";

  const prompt = `Write a warm thank-you message from Obinrin Empowerment Foundation to a donor named "${donorName}" who gave ${amountText}. Mention that their gift helps provide education, mentorship, and sanitary supplies to girls. ${lengthInstruction} Sign off as "The Obinrin Empowerment Foundation Team" (only for email, not SMS). Do not include a subject line. Return only the message body, nothing else.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}