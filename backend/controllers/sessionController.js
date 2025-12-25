import mongoose from "mongoose";
import Session from "../models/Session.js";
import Question from "../models/Question.js";
import cache from "../utils/cache.js";

// @desc Create a new session and linked questions
// @route POST /api/sessions
// @access Private
export const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions = [] } = req.body;
    const userId = req.user._id;

    if (!role || !topicsToFocus || experience === undefined || experience === null || experience === "") {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );

    session.questions = questionDocs;
    await session.save();

    // Invalidate user sessions cache
    await cache.invalidateUserSessions(userId);

    res.status(201).json({ success: true, session });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ success: false, message: "Server error while creating session" });
  }
};

// @desc Get all sessions for the logged-in user
// @route GET /api/sessions/my-sessions
// @access Private
export const getMySessions = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cacheKey = cache.getSessionKey(userId);

    // Try to get from cache first
    let sessions = await cache.getCachedSessions(userId);

    if (!sessions) {
      // Cache miss - fetch from database
      sessions = await Session.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("questions");

      // Cache the result
      await cache.setCachedSessions(userId, sessions);
    }

    res.status(200).json(sessions);
  } catch (err) {
    console.error("Error fetching user sessions:", err);
    res.status(500).json({ success: false, message: "Server error while fetching sessions" });
  }
};

// @desc Get session by ID with populated questions
// @route GET /api/sessions/:id
// @access Private
export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
        // ✅ validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid session ID format" });
    }
    const session = await Session.findById(id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      })
      .exec();

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Ensure the session belongs to the logged-in user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to access this session" });
    }

    res.status(200).json({ success: true, session });
  } catch (err) {
    console.error("Error fetching session by ID:", err);
    res.status(500).json({ success: false, message: "Server error while fetching session" });
  }
};

// @desc Delete a session and its questions
// @route DELETE /api/sessions/:id
// @access Private
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid session ID format" });
    }

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this session" });
    }

    // Delete all linked questions first
    await Question.deleteMany({ session: session._id });

    // Then delete the session
    await session.deleteOne();

    // Invalidate user sessions cache
    await cache.invalidateUserSessions(req.user._id);

    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (err) {
    console.error("Error deleting session:", err);
    res.status(500).json({ success: false, message: "Server error while deleting session" });
  }
};
