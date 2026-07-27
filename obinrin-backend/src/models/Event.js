import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    eventDate: { type: Date, required: true },
    endDate: { type: Date },

    location: {
      venue: String,
      city: String,
      country: String,
    },

    status: {
      type: String,
      enum: ["upcoming", "past", "cancelled"],
      default: "upcoming",
    },

    coverImage: {
      url: String,
      publicId: String,
    },
    gallery: [
      {
        url: String,
        publicId: String,
        caption: String,
      },
    ],

    relatedSchool: { type: mongoose.Schema.Types.ObjectId, ref: "School" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

eventSchema.index({ eventDate: 1, status: 1 });

export default mongoose.model("Event", eventSchema);
