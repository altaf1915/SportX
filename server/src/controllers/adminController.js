import User from "../models/User.js";
import Match from "../models/Match.js";
import Ground from "../models/Ground.js";
import Report from "../models/Report.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const analytics = asyncHandler(async (req, res) => {
  const [users, activeUsers, matches, revenue, sports, locations] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: "active" }),
    Match.countDocuments(),
    User.countDocuments({ isPremium: true }).then((n) => n * 499),
    Match.aggregate([{ $group: { _id: "$sport", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Match.aggregate([{ $group: { _id: "$venue.city", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }])
  ]);
  res.json({ users, activeUsers, matches, revenue, sports, locations });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort("-createdAt").limit(200);
  res.json({ users });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status, isVerified: req.body.isVerified }, { new: true });
  res.json({ user });
});

export const createGround = asyncHandler(async (req, res) => {
  const ground = await Ground.create({ ...req.body, managedBy: req.user._id });
  res.status(201).json({ ground });
});

export const listGrounds = asyncHandler(async (req, res) => {
  const grounds = await Ground.find().sort("-createdAt");
  res.json({ grounds });
});

export const listReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().populate("reporter subjectUser match").sort("-createdAt");
  res.json({ reports });
});
