// models/Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    sourceType: { type: String, enum: ["url", "upload"], required: true },
    videoUrl: { type: String }, // used when sourceType === "url" (YouTube/Vimeo link)
    uploadedVideo: {
      url: String, // used when sourceType === "upload" (Cloudinary)
      publicId: String,
    },

    thumbnail: {
      url: String,
      publicId: String,
    },

    featured: { type: Boolean, default: false }, // the one shown in VideoStory
    status: { type: String, enum: ["draft", "published"], default: "draft" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);