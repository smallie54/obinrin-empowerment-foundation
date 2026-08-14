// models/ImpactLocation.js
import mongoose from "mongoose";

const impactLocationSchema = new mongoose.Schema(
  {
    stateName: { type: String, required: true, trim: true, unique: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    visible: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("ImpactLocation", impactLocationSchema);