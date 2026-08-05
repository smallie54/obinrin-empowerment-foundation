import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Education"
    description: { type: String, required: true },
    icon: { type: String, trim: true }, // lucide-react icon name, e.g. "BookOpen"

    coverImage: {
      url: String,
      publicId: String,
    },

    highlightStat: { type: String, trim: true },

    status: {
      type: String,
      enum: ["active", "planned", "archived"],
      default: "active",
    },
    displayOrder: { type: Number, default: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

programSchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model("Program", programSchema);