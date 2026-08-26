import "dotenv/config";
import mongoose from "mongoose";
import Outreach from "../models/Outreach.js";
import Event from "../models/Event.js";

async function backfill() {
  await mongoose.connect(process.env.MONGO_URI);

  const outreachResult = await Outreach.updateMany(
    { reminderSent: { $exists: false } },
    { $set: { reminderSent: false } }
  );

  const eventResult = await Event.updateMany(
    { reminderSent: { $exists: false } },
    { $set: { reminderSent: false } }
  );

  console.log(`Backfilled reminderSent on ${outreachResult.modifiedCount} outreach record(s).`);
  console.log(`Backfilled reminderSent on ${eventResult.modifiedCount} event record(s).`);
  process.exit(0);
}

backfill().catch((err) => {
  console.error(err);
  process.exit(1);
});