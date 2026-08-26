import Outreach from "../models/Outreach.js";
import Event from "../models/Event.js";
import { createNotification } from "./notificationController.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Triggered by an external scheduler (e.g. cron-job.org) hitting this as
// an HTTP endpoint, rather than relying on the Node process staying alive
// in-memory — Render's free tier spins down on inactivity, which would
// silently break an in-process cron job.
export async function checkOutreachReminders(req, res, next) {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + SEVEN_DAYS_MS);

    const upcomingOutreach = await Outreach.find({
      status: "scheduled",
      eventDate: { $gte: now, $lte: sevenDaysFromNow },
      reminderSent: false,
    });

    for (const item of upcomingOutreach) {
      const daysAway = Math.ceil((item.eventDate - now) / (24 * 60 * 60 * 1000));

      await createNotification({
        message: `"${item.title}" (outreach) is scheduled in ${daysAway} day${daysAway === 1 ? "" : "s"}`,
        type: "outreach",
        link: "/admin/outreach",
      });

      item.reminderSent = true;
      await item.save();
    }

    const upcomingEvents = await Event.find({
      status: "upcoming",
      eventDate: { $gte: now, $lte: sevenDaysFromNow },
      reminderSent: false,
    });

    for (const item of upcomingEvents) {
      const daysAway = Math.ceil((item.eventDate - now) / (24 * 60 * 60 * 1000));

      await createNotification({
        message: `"${item.title}" (event) is happening in ${daysAway} day${daysAway === 1 ? "" : "s"}`,
        type: "outreach",
        link: "/admin/events",
      });

      item.reminderSent = true;
      await item.save();
    }

    res.json({
      checked: true,
      outreachNotificationsCreated: upcomingOutreach.length,
      eventNotificationsCreated: upcomingEvents.length,
    });
  } catch (err) {
    next(err);
  }
}