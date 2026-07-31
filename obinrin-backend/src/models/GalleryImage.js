// models/GalleryImage.js
import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String, trim: true },
    category: {
      type: String,
      enum: ["Education", "Mentorship", "Health & Well-being", "Community", "Events", "Achievements"],
      default: "Community",
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

galleryImageSchema.index({ category: 1, createdAt: -1 });

export default mongoose.model("GalleryImage", galleryImageSchema);