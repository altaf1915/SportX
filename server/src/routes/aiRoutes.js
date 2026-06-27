import express from "express";
import { chatbot, recommendations } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/recommendations", recommendations);
router.post("/chatbot", chatbot);

export default router;
