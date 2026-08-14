// models/ImpactLocation.js
import mongoose from "mongoose";

const impactLocationSchema = new mongoose.Schema(
  {
    stateName: { type: String, required: true, trim: true }, // must match your nigeria-states.json's name property exactly
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    girlsSupported: { type: Number, default: 0 },
    schools: { type: Number, default: 0 },
    volunteerTeams: { type: Number, default: 0 },

    visible: { type: Boolean, default: true }, // lets admin hide a pin without deleting it

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

impactLocationSchema.index({ stateName: 1 });

export default mongoose.model("ImpactLocation", impactLocationSchema);