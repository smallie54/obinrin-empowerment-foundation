import "dotenv/config";
import mongoose from "mongoose";
import Outreach from "../models/Outreach.js";

async function backfill() {
  await mongoose.connect(process.env.MONGO_URI);

  const result = await Outreach.updateMany(
    { reminderSent: { $exists: false } },
    { $set: { reminderSent: false } }
  );

  console.log(`Backfilled reminderSent on ${result.modifiedCount} outreach record(s).`);
  process.exit(0);
}

backfill().catch((err) => {
  console.error(err);
  process.exit(1);
});