import express from "express";
import {
    startInterview,
    chat,
    endInterview,
    getInterview,
} from "../controllers/mockInterviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startInterview);
router.post("/:id/chat", protect, chat);
router.post("/:id/end", protect, endInterview);
router.get("/:id", protect, getInterview);

export default router;
