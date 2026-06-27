import mongoose from "mongoose";
import { sports } from "./User.js";

const matchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    sport: { type: String, enum: sports, required: true },
    type: { type: String, enum: ["public", "private"], default: "public" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    maxPlayers: { type: Number, default: 10 },
    skillLevel: { type: String, enum: ["Any", "Beginner", "Intermediate", "Advanced", "Pro"], default: "Any" },
    startsAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 90 },
    venue: {
      name: String,
      address: String,
      city: String,
      indoor: Boolean,
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] }
      }
    },
    price: { type: Number, default: 0 },
    status: { type: String, enum: ["open", "full", "completed", "cancelled"], default: "open" },
    notes: String
  },
  { timestamps: true }
);

matchSchema.index({ "venue.location": "2dsphere" });
matchSchema.index({ title: "text", sport: "text", "venue.city": "text" });

export default mongoose.model("Match", matchSchema);
