import express from "express";
import { analytics, createGround, listGrounds, listReports, listUsers, updateUserStatus } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/analytics", analytics);
router.get("/users", listUsers);
router.patch("/users/:id", updateUserStatus);
router.route("/grounds").get(listGrounds).post(createGround);
router.get("/reports", listReports);

export default router;
