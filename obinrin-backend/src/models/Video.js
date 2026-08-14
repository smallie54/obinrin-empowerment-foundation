// models/Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    sourceType: { type: String, enum: ["url", "upload"], required: true },
    videoUrl: { type: String }, // YouTube/Vimeo link, used when sourceType === "url"
    uploadedVideo: {
      url: String,
      publicId: String,
    },

    thumbnail: {
      url: String,
      publicId: String,
    },

    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "draft" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);