import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },

    tags: [{ type: String, trim: true }], // e.g. "major-donor", "recurring", "corporate"
    notes: { type: String },

    // Denormalized for fast dashboard reads — recalculated whenever a
    // donation tied to this donor's email settles as successful.
    totalDonated: { type: Number, default: 0 }, // smallest currency unit, per-currency handled by totalsByCurrency
    totalsByCurrency: [
      {
        currency: String,
        amount: Number,
      },
    ],
    donationCount: { type: Number, default: 0 },
    lastDonationAt: { type: Date },

    subscribedToNewsletter: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Donor", donorSchema);
