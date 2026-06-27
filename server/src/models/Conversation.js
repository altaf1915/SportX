import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    match: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
