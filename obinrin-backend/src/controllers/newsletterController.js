import crypto from "crypto";
import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "../config/mailer.js";

export async function subscribe(req, res, next) {
  try {
    const { email } = req.body;

    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      if (!subscriber.subscribed) {
        subscriber.subscribed = true;
        await subscriber.save();
      }
      return res.json({ message: "Subscribed" });
    }

    subscriber = await Subscriber.create({
      email,
      unsubscribeToken: crypto.randomBytes(20).toString("hex"),
    });

    res.status(201).json({ message: "Subscribed" });
  } catch (err) {
    next(err);
  }
}

export async function unsubscribe(req, res, next) {
  try {
    const { token } = req.params;

    const subscriber = await Subscriber.findOneAndUpdate(
      { unsubscribeToken: token },
      { subscribed: false }
    );

    if (!subscriber) {
      return res.status(404).json({ message: "Invalid unsubscribe link" });
    }

    res.json({ message: "Unsubscribed" });
  } catch (err) {
    next(err);
  }
}

export async function listSubscribers(req, res, next) {
  try {
    const subscribers = await Subscriber.find({ subscribed: true }).sort({
      createdAt: -1,
    });
    res.json(subscribers);
  } catch (err) {
    next(err);
  }
}

// Sends a one-off newsletter/announcement email to every active subscriber.
// For real scale this should be queued (e.g. BullMQ) rather than sent inline.
export async function broadcastNewsletter(req, res, next) {
  try {
    const { subject, html } = req.body;

    const subscribers = await Subscriber.find({ subscribed: true });

    await Promise.allSettled(
      subscribers.map((sub) =>
        sendEmail({
          to: sub.email,
          subject,
          html: `${html}<hr/><p style="font-size:12px;color:#888;">
            <a href="${process.env.CLIENT_URL}/unsubscribe/${sub.unsubscribeToken}">Unsubscribe</a>
          </p>`,
        })
      )
    );

    res.json({ message: `Newsletter sent to ${subscribers.length} subscribers` });
  } catch (err) {
    next(err);
  }
}
