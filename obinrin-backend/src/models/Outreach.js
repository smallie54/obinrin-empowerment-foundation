import mongoose from "mongoose";

const outreachSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },

    status: {
      type: String,
      enum: ["idea", "planning", "scheduled", "in-progress", "completed"],
      default: "idea",
    },
    reminderSent: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    eventDate: { type: Date },
    budget: { type: Number, default: 0 }, // smallest currency unit
    currency: { type: String, default: "NGN" },

    volunteersNeeded: { type: Number, default: 0 },
    volunteersAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }],

    // Filled in once status = "completed"
    girlsReached: { type: Number },

    relatedSchool: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

outreachSchema.index({ status: 1, eventDate: 1 });

export default mongoose.model("Outreach", outreachSchema);
