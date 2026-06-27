import Match from "../models/Match.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createMatch = asyncHandler(async (req, res) => {
  const startsAt = new Date(req.body.startsAt);
  if (!req.body.title || !req.body.sport || Number.isNaN(startsAt.getTime())) {
    res.status(422);
    throw new Error("Title, sport, and a valid start time are required");
  }
  const match = await Match.create({
    ...req.body,
    startsAt,
    maxPlayers: Math.max(2, Number(req.body.maxPlayers || 10)),
    creator: req.user._id,
    players: [req.user._id]
  });
  res.status(201).json({ match });
});

export const listMatches = asyncHandler(async (req, res) => {
  const { sport, city, status = "open", lng, lat, distance = 30000 } = req.query;
  const filter = {};
  if (sport) filter.sport = sport;
  if (city) filter["venue.city"] = new RegExp(city, "i");
  if (status) filter.status = status;
  if (lng && lat) {
    filter["venue.location"] = {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(distance)
      }
    };
  }
  const matches = await Match.find(filter).populate("creator players", "name avatar rating isVerified").sort("startsAt").limit(100);
  res.json({ matches });
});

export const joinMatch = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id);
  if (!match || match.status !== "open") {
    res.status(404);
    throw new Error("Match is not available");
  }
  if (!match.players.some((id) => id.equals(req.user._id))) {
    if (match.players.length >= match.maxPlayers) {
      match.waitlist.addToSet(req.user._id);
    } else {
      match.players.addToSet(req.user._id);
      if (match.players.length >= match.maxPlayers) match.status = "full";
    }
    await match.save();
    await Notification.create({ user: match.creator, type: "match", title: "New player joined", body: `${req.user.name} joined ${match.title}`, link: `/matches/${match._id}` });
    req.app.get("io")?.to(`match:${match._id}`).emit("match:updated", match);
  }
  res.json({ match });
});

export const leaveMatch = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id);
  if (!match) {
    res.status(404);
    throw new Error("Match not found");
  }
  match.players.pull(req.user._id);
  match.waitlist.pull(req.user._id);
  if (match.status === "full") match.status = "open";
  await match.save();
  res.json({ match });
});

export const myMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find({ players: req.user._id }).sort("-startsAt").populate("players", "name avatar");
  res.json({ matches });
});
