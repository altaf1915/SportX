import express from "express";
import { createCommunity, createDiscussion, createEvent, generateTournament, joinCommunity, listCommunities, listEvents } from "../controllers/communityController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listCommunities).post(createCommunity);
router.post("/:id/join", joinCommunity);
router.post("/:id/discussions", createDiscussion);
router.route("/events").get(listEvents).post(createEvent);
router.post("/tournament/generate", generateTournament);

export default router;
