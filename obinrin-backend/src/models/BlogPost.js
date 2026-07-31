import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true },

    category: { type: String, trim: true },
    coverImage: {
      url: String,
      publicId: String,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: { type: Date },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

blogPostSchema.index({ status: 1, publishedAt: -1 });

export default mongoose.model("BlogPost", blogPostSchema);