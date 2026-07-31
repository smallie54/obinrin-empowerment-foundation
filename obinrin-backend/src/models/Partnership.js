import mongoose from "mongoose";

const partnershipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactName: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },

    status: {
      type: String,
      enum: ["active", "pending", "inactive"],
      default: "pending",
    },

    fundingProgress: { type: Number, default: 0, min: 0, max: 100 }, // percent
    lastMeetingAt: { type: Date },
    nextFollowUpAt: { type: Date },

    notes: { type: String },
    logo: {
      url: String,
      publicId: String,
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

partnershipSchema.index({ status: 1 });

export default mongoose.model("Partnership", partnershipSchema);
