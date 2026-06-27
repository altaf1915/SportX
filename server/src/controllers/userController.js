import User from "../models/User.js";
import Review from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "bio", "city", "age", "gender", "sportsInterests", "skillLevel", "availability", "location", "avatar"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  }
  await req.user.save();
  res.json({ user: req.user });
});

export const upgradePremium = asyncHandler(async (req, res) => {
  req.user.isPremium = true;
  await req.user.save();
  res.json({ user: req.user, message: "Premium enabled" });
});

export const findPartners = asyncHandler(async (req, res) => {
  const { sport, skillLevel, gender, city, q, minAge, maxAge, lng, lat, distance = 25000 } = req.query;
  const filter = { _id: { $ne: req.user._id }, status: "active" };
  if (sport) filter.sportsInterests = sport;
  if (skillLevel) filter.skillLevel = skillLevel;
  if (gender) filter.gender = gender;
  if (city) filter.city = new RegExp(city, "i");
  if (minAge || maxAge) filter.age = { ...(minAge && { $gte: Number(minAge) }), ...(maxAge && { $lte: Number(maxAge) }) };
  if (q) filter.$text = { $search: q };
  if (lng && lat) {
    filter.location = {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(distance)
      }
    };
  }
  const players = await User.find(filter).select("-otp").limit(60).sort({ isPremium: -1, trustScore: -1 });
  res.json({ players });
});

export const getPlayer = asyncHandler(async (req, res) => {
  const player = await User.findById(req.params.id).select("-otp");
  const reviews = await Review.find({ player: req.params.id }).populate("reviewer", "name avatar").sort("-createdAt");
  if (!player) {
    res.status(404);
    throw new Error("Player not found");
  }
  res.json({ player, reviews });
});

export const ratePlayer = asyncHandler(async (req, res) => {
  const review = await Review.create({
    reviewer: req.user._id,
    player: req.params.id,
    match: req.body.match,
    rating: req.body.rating,
    fairPlay: req.body.fairPlay,
    body: req.body.body
  });
  const stats = await Review.aggregate([
    { $match: { player: review.player } },
    { $group: { _id: "$player", average: { $avg: "$rating" }, count: { $sum: 1 }, fairPlay: { $avg: "$fairPlay" } } }
  ]);
  if (stats[0]) {
    await User.findByIdAndUpdate(review.player, {
      rating: { average: Number(stats[0].average.toFixed(2)), count: stats[0].count },
      fairPlayScore: Math.round(stats[0].fairPlay),
      trustScore: Math.min(100, Math.round(stats[0].fairPlay * 0.7 + stats[0].average * 6))
    });
  }
  res.status(201).json({ review });
});
