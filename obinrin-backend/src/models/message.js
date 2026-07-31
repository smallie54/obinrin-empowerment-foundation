
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    donorName: { type: String, trim: true },
    donorEmail: { type: String, trim: true },
    channel: { type: String, enum: ["email", "sms"], required: true },
    subject: String,
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ["sent", "pending", "failed"],
      default: "pending",
    },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);