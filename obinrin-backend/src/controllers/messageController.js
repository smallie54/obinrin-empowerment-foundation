
import Message from "../models/message.js";
// import { generateThankYouDraft } from "../config/geminiService.js";
import { generateThankYouDraft } from "../config/groqServices.js";
import { sendEmail } from "../config/mailer.js";

export async function draftThankYouMessage(req, res, next) {
  try {
    const { donorName, amount, currency, channel } = req.body;
    const draft = await generateThankYouDraft({ donorName, amount, currency, channel });
    res.json({ draft });
  } catch (err) {
    next(err);
  }
}

export async function sendThankYouMessage(req, res, next) {
  try {
    const { donorEmail, donorName, channel, subject, body } = req.body;

    if (channel === "sms") {
      // No SMS provider wired up yet — log as pending rather than
      // pretending it actually sent.
      const message = await Message.create({
        donorName,
        donorEmail,
        channel,
        subject,
        body,
        status: "pending",
        sentBy: req.admin._id,
      });
      return res.json({
        message: "SMS provider not connected yet — saved as pending.",
        record: message,
      });
    }

    try {
      await sendEmail({ to: donorEmail, subject, text: body });
      const message = await Message.create({
        donorName,
        donorEmail,
        channel,
        subject,
        body,
        status: "sent",
        sentBy: req.admin._id,
      });
      return res.json({ message: "Sent!", record: message });
    } catch (emailErr) {
      await Message.create({
        donorName,
        donorEmail,
        channel,
        subject,
        body,
        status: "failed",
        sentBy: req.admin._id,
      });
      throw emailErr;
    }
  } catch (err) {
    next(err);
  }
}

export async function listRecentMessages(req, res, next) {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(10);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

export async function listMessages(req, res, next) {
  try {
    const { status, channel } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (channel) filter.channel = channel;

    const messages = await Message.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
}