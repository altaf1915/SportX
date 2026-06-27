import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subjectUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    match: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
    reason: String,
    status: { type: String, enum: ["open", "reviewing", "resolved"], default: "open" },
    resolution: String
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
