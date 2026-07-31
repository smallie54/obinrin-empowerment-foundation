// models/Story.js
import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String }, // full story text, for a future detail page

    category: {
      type: String,
      enum: ["Education", "Mentorship", "Health & Wellness", "Leadership", "Community", "Skill Development"],
      required: true,
    },
    featured: { type: Boolean, default: false },

    girlName: { type: String, trim: true },
    girlAge: { type: Number },
    location: { type: String, trim: true },

    coverImage: {
      url: String,
      publicId: String,
    },
    avatarImage: {
      url: String,
      publicId: String,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

storySchema.index({ status: 1, category: 1, createdAt: -1 });

export default mongoose.model("Story", storySchema);