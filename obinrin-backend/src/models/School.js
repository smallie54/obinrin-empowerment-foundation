import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    region: { type: String, trim: true }, // state/province
    address: { type: String, trim: true },

    girlsSupported: { type: Number, default: 0 },
    programsDelivered: [
      {
        type: String,
        enum: [
          "educational-materials",
          "sanitary-pads",
          "mentorship",
          "leadership-development",
        ],
      },
    ],

    dateEmpowermentStarted: { type: Date },
    status: {
      type: String,
      enum: ["active", "completed", "planned"],
      default: "active",
    },

    images: [
      {
        url: String,
        publicId: String, // cloudinary public_id, for deletion
        caption: String,
      },
    ],

    notes: { type: String },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

schoolSchema.index({ country: 1, status: 1 });

export default mongoose.model("School", schoolSchema);
