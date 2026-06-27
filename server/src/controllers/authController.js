import crypto from "crypto";
import { body } from "express-validator";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions, signToken } from "../utils/token.js";

export const signupRules = [
  body("name").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 })
];

export const loginRules = [body("email").isEmail().normalizeEmail(), body("password").notEmpty()];
export const resetRules = [body("token").notEmpty(), body("password").isLength({ min: 8 })];
export const changePasswordRules = [body("currentPassword").notEmpty(), body("newPassword").isLength({ min: 8 })];

function sendAuth(res, user, status = 200) {
  const token = signToken(user);
  const safeUser = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete safeUser.password;
  delete safeUser.otp;
  delete safeUser.resetPasswordToken;
  delete safeUser.resetPasswordExpires;
  res.cookie("token", token, cookieOptions());
  res.status(status).json({ token, user: safeUser });
}

export const signup = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) {
    res.status(409);
    throw new Error("Email already registered");
  }
  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    city: req.body.city,
    otp: { code: otpCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
  });
  sendAuth(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  sendAuth(res, user);
});

export const refresh = asyncHandler(async (req, res) => {
  sendAuth(res, req.user);
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions());
  res.json({ message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.otp?.code || user.otp.code !== req.body.code || user.otp.expiresAt < new Date()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }
  user.isVerified = true;
  user.otp = undefined;
  await user.save();
  res.json({ message: "Account verified", user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  let resetToken;
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
  }
  res.json({
    message: "If an account exists, password reset instructions were sent.",
    resetToken: process.env.NODE_ENV === "production" ? undefined : resetToken
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash("sha256").update(req.body.token).digest("hex");
  const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: new Date() } }).select("+password");
  if (!user) {
    res.status(400);
    throw new Error("Reset token is invalid or expired");
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  sendAuth(res, user);
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!user || !(await user.comparePassword(req.body.currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }
  user.password = req.body.newPassword;
  await user.save();
  sendAuth(res, user);
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { email, name, googleId, avatar } = req.body;
  if (!email || !googleId) {
    res.status(422);
    throw new Error("Google profile is required");
  }
  const user = await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { name, email, googleId, avatar: avatar ? { url: avatar } : undefined, isVerified: true } },
    { upsert: true, new: true }
  );
  sendAuth(res, user);
});
