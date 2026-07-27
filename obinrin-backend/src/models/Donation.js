import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, trim: true },
    donorEmail: { type: String, required: true, lowercase: true, trim: true },

    amount: { type: Number, required: true }, // in the smallest currency unit (e.g. cents/kobo)
    currency: { type: String, required: true, default: "USD" },

    provider: {
      type: String,
      enum: ["stripe", "paystack"],
      required: true,
    },
    providerReference: { type: String, required: true }, // Stripe payment_intent id / Paystack reference

    status: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },

    isRecurring: { type: Boolean, default: false },
    dedicatedTo: { type: String, trim: true }, // for tribute donations

    designatedSchool: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  },
  { timestamps: true }
);

donationSchema.index({ providerReference: 1 }, { unique: true });
donationSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Donation", donationSchema);
