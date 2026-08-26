import Outreach from "../models/Outreach.js";
import { createNotification } from "./notificationController.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function checkOutreachReminders(req, res, next) {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + SEVEN_DAYS_MS);

    const upcoming = await Outreach.find({
      status: "scheduled",
      eventDate: { $gte: now, $lte: sevenDaysFromNow },
      reminderSent: false,
    });

    for (const event of upcoming) {
      const daysAway = Math.ceil((event.eventDate - now) / (24 * 60 * 60 * 1000));

      await createNotification({
        message: `"${event.title}" is scheduled in ${daysAway} day${daysAway === 1 ? "" : "s"}`,
        type: "outreach",
        link: "/admin/outreach",
      });

      event.reminderSent = true;
      await event.save();
    }

    res.json({ checked: true, notificationsCreated: upcoming.length });
  } catch (err) {
    next(err);
  }
}