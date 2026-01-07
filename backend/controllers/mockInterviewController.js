import MockInterview from "../models/MockInterview.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModelId = () => {
    let modelEnv = (process.env.GEMINI_MODEL || "").trim();
    if (!modelEnv) modelEnv = "gemini-1.5-flash";
    return modelEnv;
};

// Start a new interview session
export const startInterview = async (req, res) => {
    try {
        const { role, experience, topics } = req.body;
        const userId = req.user._id;

        if (!role || !experience || !topics) {
            return res.status(400).json({ message: "Missing required fields: role, experience, or topics" });
        }

        // Check if GEMINI_API_KEY is configured
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not configured");
            return res.status(500).json({ message: "AI service is not configured. Please contact support." });
        }

        // Generate the first question using AI
        const prompt = `You are an expert interviewer conducting a technical interview for a ${role} position with ${experience} years of experience. The topics to focus on are: ${topics}.
    Start the interview by asking the first question.
    Return ONLY the question text. Do not include "Question 1" or similar prefixes.`;

        const modelId = getModelId();
        const model = genAI.getGenerativeModel({ model: modelId });
        const result = await model.generateContent(prompt);
        const question = result.response.text().trim();

        // Create the interview session
        const interview = new MockInterview({
            user: userId,
            role,
            experience,
            topics,
            status: "active",
            conversation: [
                {
                    role: "ai",
                    content: question,
                },
            ],
        });

        await interview.save();

        res.status(201).json(interview);
    } catch (error) {
        console.error("Error starting interview:", error);
        res.status(500).json({ message: "Failed to start interview", error: error.message });
    }
};

// Handle chat interaction (User Answer -> AI Feedback -> AI Next Question)
export const chat = async (req, res) => {
    try {
        const { id } = req.params;
        const { answer } = req.body;
        const userId = req.user._id;

        if (!answer) {
            return res.status(400).json({ message: "Answer is required" });
        }

        const interview = await MockInterview.findOne({ _id: id, user: userId });

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        if (interview.status === "completed") {
            return res.status(400).json({ message: "Interview is already completed" });
        }

        // Get the last question asked by AI
        const lastQuestion = interview.conversation.filter((c) => c.role === "ai").pop();

        if (!lastQuestion) {
            return res.status(500).json({ message: "Invalid conversation state" });
        }

        // 1. Evaluate existing answer
        const feedbackPrompt = `You are an expert interviewer. The user has answered the following question:
    Question: "${lastQuestion.content}"
    User Answer: "${answer}"
    
    Provide feedback on the answer. Was it correct? What was missing? How can it be improved?
    Also rate the answer on a scale of 1-10.
    
    Return JSON format:
    {
      "feedback": "...",
      "rating": 8
    }`;

        const modelId = getModelId();
        const model = genAI.getGenerativeModel({ model: modelId });

        const feedbackResult = await model.generateContent(feedbackPrompt);
        const feedbackText = feedbackResult.response.text();

        let feedbackData = { feedback: "Could not generate feedback", rating: 0 };
        try {
            const cleanedText = feedbackText.replace(/```json\s*/g, "").replace(/```/g, "").trim();
            feedbackData = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse feedback JSON", e);
            feedbackData.feedback = feedbackText; // Fallback
        }

        // Save user's answer with feedback
        interview.conversation.push({
            role: "user",
            content: answer,
            feedback: feedbackData.feedback,
            rating: feedbackData.rating,
        });

        // 2. Generate next question
        // Construct history for context
        let history = `Interview Context: Role: ${interview.role}, Experience: ${interview.experience} years, Topics: ${interview.topics}.\n\n`;
        interview.conversation.forEach(msg => {
            history += `${msg.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${msg.content}\n`;
        });

        const nextQuestionPrompt = `${history}
    
    Based on the previous conversation, ask the next relevant interview question.
    If the candidate's last answer was weak, you can ask a follow-up or dig deeper.
    If it was good, move to the next topic.
    Return ONLY the question text.`;

        const nextQuestionResult = await model.generateContent(nextQuestionPrompt);
        const nextQuestion = nextQuestionResult.response.text().trim();

        interview.conversation.push({
            role: "ai",
            content: nextQuestion
        });

        await interview.save();

        res.status(200).json(interview);

    } catch (error) {
        console.error("Error processing chat:", error);
        res.status(500).json({ message: "Failed to process answer", error: error.message });
    }
};

// End the interview and generate overall feedback
export const endInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const interview = await MockInterview.findOne({ _id: id, user: userId });

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        if (interview.status === "completed") {
            return res.status(200).json(interview);
        }

        // Generate overall feedback
        let history = `Interview Context: Role: ${interview.role}, Experience: ${interview.experience} years, Topics: ${interview.topics}.\n\n`;
        interview.conversation.forEach(msg => {
            // Skip the last AI question if it hasn't been answered yet (unless it's the only thing)
            if (msg.role === 'ai' && msg === interview.conversation[interview.conversation.length - 1] && interview.conversation[interview.conversation.length - 1].role === 'ai') {
                return;
            }
            history += `${msg.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${msg.content}\n`;
            if (msg.role === 'user' && msg.rating) {
                history += `(Rating: ${msg.rating}/10)\n`;
            }
        });

        const finalPrompt = `${history}
        
        The interview has ended. Please provide a comprehensive summary and feedback for the candidate.
        Highlight strengths, areas for improvement, and a final overall score (out of 100).
        
        Return JSON format:
        {
            "overallFeedback": "...",
            "overallScore": 85
        }`;

        const modelId = getModelId();
        const model = genAI.getGenerativeModel({ model: modelId });
        const result = await model.generateContent(finalPrompt);
        const text = result.response.text();

        let finalData = { overallFeedback: "Could not generate feedback", overallScore: 0 };
        try {
            const cleanedText = text.replace(/```json\s*/g, "").replace(/```/g, "").trim();
            finalData = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse final feedback JSON", e);
            finalData.overallFeedback = text;
        }

        // Clean up: Remove the last unanswered question if exists
        const lastItem = interview.conversation[interview.conversation.length - 1];
        if (lastItem.role === 'ai') {
            interview.conversation.pop();
        }

        interview.status = "completed";
        interview.overallFeedback = finalData.overallFeedback;
        interview.overallScore = finalData.overallScore;

        await interview.save();

        res.status(200).json(interview);

    } catch (error) {
        console.error("Error ending interview:", error);
        res.status(500).json({ message: "Failed to end interview", error: error.message });
    }
};

// Get interview details
export const getInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const interview = await MockInterview.findOne({ _id: id, user: userId });

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        res.status(200).json(interview);
    } catch (error) {
        console.error("Error fetching interview:", error);
        res.status(500).json({ message: "Failed to fetch interview", error: error.message });
    }
};
