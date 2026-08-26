import cron from "node-cron";
import Outreach from "../models/Outreach.js";
import { createNotification } from "../controllers/notificationController.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

async function checkUpcomingOutreach() {
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

    if (upcoming.length > 0) {
      console.log(`Outreach reminder job: created ${upcoming.length} notification(s).`);
    }
  } catch (err) {
    console.error("Outreach reminder job failed:", err.message);
  }
}

// Runs once a day at 8:00 AM server time.
export function startOutreachReminderJob() {
  cron.schedule("0 8 * * *", checkUpcomingOutreach);
  console.log("Outreach reminder job scheduled (daily at 8:00 AM).");
}

// Exported separately so you can trigger it manually for testing,
// without waiting for the actual scheduled time.
export { checkUpcomingOutreach };