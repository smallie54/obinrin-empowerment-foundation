import "dotenv/config";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import Admin from "../models/Admin.js";

async function resetPassword() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.SEED_SUPERADMIN_EMAIL;
  const newPassword = process.env.RESET_ADMIN_PASSWORD;

  if (!email || !newPassword) {
    console.error("Set SEED_SUPERADMIN_EMAIL and RESET_ADMIN_PASSWORD in your .env before running this.");
    process.exit(1);
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    console.error(`No admin found for ${email}`);
    process.exit(1);
  }

  admin.passwordHash = await Admin.hashPassword(newPassword);
  await admin.save();

  console.log(`Password reset for ${email}.`);
  process.exit(0);
}

resetPassword().catch((err) => {
  console.error(err);
  process.exit(1);
});