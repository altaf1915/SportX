import express from "express";
import { getMessages, listConversations, markRead, sendMessage, startConversation } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.route("/conversations").get(listConversations).post(startConversation);
router.route("/conversations/:id/messages").get(getMessages).post(sendMessage);
router.patch("/conversations/:id/read", markRead);

export default router;
