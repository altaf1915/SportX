import Community from "../models/Community.js";
import Event from "../models/Event.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCommunity = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.sport) {
    res.status(422);
    throw new Error("Community name and sport are required");
  }
  const community = await Community.create({ ...req.body, owner: req.user._id, moderators: [req.user._id], members: [req.user._id] });
  res.status(201).json({ community });
});

export const listCommunities = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.sport) filter.sport = req.query.sport;
  if (req.query.city) filter.city = new RegExp(req.query.city, "i");
  const communities = await Community.find(filter).populate("owner members", "name avatar").sort("-createdAt").limit(80);
  res.json({ communities });
});

export const joinCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findByIdAndUpdate(req.params.id, { $addToSet: { members: req.user._id } }, { new: true });
  res.json({ community });
});

export const createDiscussion = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);
  if (!community) {
    res.status(404);
    throw new Error("Community not found");
  }
  if (!req.body.title || !req.body.body) {
    res.status(422);
    throw new Error("Discussion title and body are required");
  }
  community.discussions.push({ author: req.user._id, title: req.body.title, body: req.body.body });
  await community.save();
  res.status(201).json({ community });
});

export const createEvent = asyncHandler(async (req, res) => {
  if (!req.body.title || !req.body.sport) {
    res.status(422);
    throw new Error("Event title and sport are required");
  }
  const event = await Event.create({ ...req.body, organizer: req.user._id });
  res.status(201).json({ event });
});

export const listEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().populate("organizer attendees", "name avatar").sort("startsAt").limit(100);
  res.json({ events });
});

export const generateTournament = asyncHandler(async (req, res) => {
  const players = req.body.players || [];
  const bracket = [];
  for (let i = 0; i < players.length; i += 2) {
    bracket.push({ round: 1, playerA: players[i], playerB: players[i + 1] || "BYE", winner: players[i + 1] ? "" : players[i] });
  }
  res.json({ format: req.body.format || "knockout", bracket });
});
