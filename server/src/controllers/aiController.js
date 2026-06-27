import Match from "../models/Match.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const recommendations = asyncHandler(async (req, res) => {
  const user = req.user;
  const sports = user.sportsInterests?.length ? user.sportsInterests : ["Cricket", "Football", "Chess"];
  const [matches, partners] = await Promise.all([
    Match.find({ sport: { $in: sports }, status: "open" }).populate("players", "name avatar").sort("startsAt").limit(8),
    User.find({ _id: { $ne: user._id }, sportsInterests: { $in: sports }, city: user.city }).select("name avatar sportsInterests skillLevel rating trustScore isVerified").limit(8)
  ]);
  res.json({
    matches,
    partners,
    fitnessTips: [
      "Warm up for 8-12 minutes before intense play.",
      `Add one skill drill for ${sports[0]} this week.`,
      "Hydrate before the match, not only during breaks."
    ]
  });
});

export const chatbot = asyncHandler(async (req, res) => {
  const prompt = String(req.body.message || "").toLowerCase();
  const answer = prompt.includes("tournament")
    ? "Use knockout for quick events, round-robin for small groups where everyone should play everyone."
    : prompt.includes("fitness")
      ? "Train mobility, short sprints, and recovery. Consistency beats heroic one-day workouts."
      : "I can suggest partners, matches, tournament formats, and simple training plans based on your sport and availability.";
  res.json({ answer });
});
