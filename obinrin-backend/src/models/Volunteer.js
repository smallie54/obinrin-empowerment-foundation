import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },

    skills: [{ type: String, trim: true }],
    availability: { type: String, trim: true }, // e.g. "weekends", "flexible"

    status: {
      type: String,
      enum: ["available", "assigned", "inactive"],
      default: "available",
    },

    // Outreach events this volunteer is currently assigned to
    assignedOutreach: [{ type: mongoose.Schema.Types.ObjectId, ref: "Outreach" }],

    notes: { type: String },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

volunteerSchema.index({ status: 1 });

export default mongoose.model("Volunteer", volunteerSchema);
