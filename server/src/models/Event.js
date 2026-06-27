import mongoose from "mongoose";
import { sports } from "./User.js";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    sport: { type: String, enum: sports, required: true },
    format: { type: String, enum: ["meetup", "league", "knockout", "round-robin"], default: "meetup" },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    startsAt: Date,
    endsAt: Date,
    venue: { name: String, address: String, city: String },
    capacity: Number,
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bracket: [{ round: Number, playerA: String, playerB: String, winner: String }]
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
