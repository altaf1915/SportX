import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate("participants", "name avatar isVerified")
    .populate("lastMessage")
    .sort("-updatedAt");
  res.json({ conversations });
});

export const startConversation = asyncHandler(async (req, res) => {
  const participants = [...new Set([String(req.user._id), ...req.body.participants])];
  let conversation = await Conversation.findOne({ participants: { $all: participants, $size: participants.length } });
  if (!conversation) conversation = await Conversation.create({ participants, match: req.body.match, community: req.body.community });
  res.status(201).json({ conversation });
});

export const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({ _id: req.params.id, participants: req.user._id });
  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }
  const messages = await Message.find({ conversation: conversation._id }).populate("sender", "name avatar").sort("createdAt");
  res.json({ messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({ _id: req.params.id, participants: req.user._id });
  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }
  const message = await Message.create({ conversation: conversation._id, sender: req.user._id, body: req.body.body, media: req.body.media, readBy: [req.user._id] });
  conversation.lastMessage = message._id;
  await conversation.save();
  req.app.get("io")?.to(String(conversation._id)).emit("message:new", message);
  res.status(201).json({ message });
});

export const markRead = asyncHandler(async (req, res) => {
  await Message.updateMany({ conversation: req.params.id }, { $addToSet: { readBy: req.user._id } });
  req.app.get("io")?.to(String(req.params.id)).emit("message:read", { conversation: req.params.id, user: req.user._id });
  res.json({ message: "Marked read" });
});
