import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isDonor: { type: Boolean, default: false },
    subscribed: { type: Boolean, default: true },
    unsubscribeToken: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Subscriber", subscriberSchema);
