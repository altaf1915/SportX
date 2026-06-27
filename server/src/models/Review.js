import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    player: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    match: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
    rating: { type: Number, min: 1, max: 5, required: true },
    fairPlay: { type: Number, min: 1, max: 100, default: 90 },
    body: { type: String, maxlength: 500 }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
