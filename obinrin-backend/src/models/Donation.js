import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, trim: true },
    donorEmail: { type: String, required: true, lowercase: true, trim: true },

    amount: { type: Number, required: true }, // in the smallest currency unit (e.g. cents/kobo)
    currency: { type: String, required: true, default: "USD" },

    provider: {
      type: String,
      enum: ["stripe", "paystack", "bank_transfer", "opay", "cash", "manual"],
      required: true,
    },
    // Only Stripe/Paystack transactions have this. Manually logged
    // donations (bank transfer, Opay, cash) won't, so it's no longer
    // required — sparse uniqueness means multiple docs can have it unset.
    providerReference: { type: String },

    status: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },

    isRecurring: { type: Boolean, default: false },
    dedicatedTo: { type: String, trim: true },

    designatedSchool: { type: mongoose.Schema.Types.ObjectId, ref: "School" },

    // Powers the Receipt / Thank You columns on the admin dashboard's
    // Recent Donations table.
    receiptSent: { type: Boolean, default: false },
    thankYouSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

donationSchema.index({ providerReference: 1 }, { unique: true, sparse: true });
donationSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Donation", donationSchema);