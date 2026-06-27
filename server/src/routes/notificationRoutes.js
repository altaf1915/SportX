import express from "express";
import { listNotifications, markNotificationsRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/", listNotifications);
router.patch("/read", markNotificationsRead);

export default router;
