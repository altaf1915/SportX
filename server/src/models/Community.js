import mongoose from "mongoose";
import { sports } from "./User.js";

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sport: { type: String, enum: sports, required: true },
    description: String,
    city: String,
    cover: { url: String, publicId: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    discussions: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        title: String,
        body: String,
        comments: [{ author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, body: String, createdAt: Date }]
      }
    ]
  },
  { timestamps: true }
);

communitySchema.index({ name: "text", sport: "text", city: "text" });

export default mongoose.model("Community", communitySchema);
