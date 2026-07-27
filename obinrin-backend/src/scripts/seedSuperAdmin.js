import "dotenv/config";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.SEED_SUPERADMIN_EMAIL;
  const existing = await Admin.findOne({ email });

  if (existing) {
    console.log(`Admin already exists for ${email}, skipping.`);
    process.exit(0);
  }

  const passwordHash = await Admin.hashPassword(
    process.env.SEED_SUPERADMIN_PASSWORD
  );

  await Admin.create({
    name: process.env.SEED_SUPERADMIN_NAME,
    email,
    passwordHash,
    role: "superadmin",
  });

  console.log(`Superadmin created: ${email}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
