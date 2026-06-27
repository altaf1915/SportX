import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["match", "chat", "system", "premium"], default: "system" },
    title: String,
    body: String,
    link: String,
    readAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
