import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort("-createdAt").limit(80);
  res.json({ notifications });
});

export const markNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, readAt: null }, { readAt: new Date() });
  res.json({ message: "Notifications read" });
});
