import express from "express";
import {
  changePassword,
  changePasswordRules,
  forgotPassword,
  googleLogin,
  login,
  loginRules,
  logout,
  me,
  refresh,
  resetPassword,
  resetRules,
  signup,
  signupRules,
  verifyOtp
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/signup", signupRules, validate, signup);
router.post("/login", loginRules, validate, login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetRules, validate, resetPassword);
router.post("/verify-otp", protect, verifyOtp);
router.post("/change-password", protect, changePasswordRules, validate, changePassword);
router.post("/refresh", protect, refresh);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
