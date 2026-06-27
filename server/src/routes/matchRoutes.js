import express from "express";
import { createMatch, joinMatch, leaveMatch, listMatches, myMatches } from "../controllers/matchController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listMatches).post(createMatch);
router.get("/mine", myMatches);
router.post("/:id/join", joinMatch);
router.post("/:id/leave", leaveMatch);

export default router;
