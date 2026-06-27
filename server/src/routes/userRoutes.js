import express from "express";
import { findPartners, getPlayer, ratePlayer, updateProfile, upgradePremium } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/partners", findPartners);
router.get("/:id", getPlayer);
router.patch("/me/profile", updateProfile);
router.post("/me/premium", upgradePremium);
router.post("/:id/reviews", ratePlayer);

export default router;
