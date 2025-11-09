import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import crypto from "crypto";
import cache from "../utils/cache.js";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to get model ID
const getModelId = () => {
  let modelEnv = (process.env.GEMINI_MODEL || "").trim();
  if (!modelEnv) modelEnv = "gemini-2.5-flash"; // default model - faster for quick responses
  return modelEnv;
};

export const generateInterviewQuestions = async (req, res) => {
  try {
    console.log("Starting question generation...");
    const { role, experience, topicsToFocus, numberOfQuestions = 5 } = req.body;

    if (!role || experience == null || !topicsToFocus) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Construct prompt
    const topics = Array.isArray(topicsToFocus) ? topicsToFocus.join(", ") : String(topicsToFocus);
    const prompt = `Generate ${numberOfQuestions} interview questions and answers for a ${role} position
    with ${experience} years of experience. Topics: ${topics}.
    Format as JSON: {"questions":[{"question":"...","answer":"..."}]}`;

    try {
      // Use configurable model
      const modelId = getModelId();
      console.log("Using AI model:", modelId);
      const model = genAI.getGenerativeModel({ model: modelId });
      
      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Raw AI response received");

      // Parse and validate response
      try {
        const cleanedText = text.replace(/```json\s*/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(cleanedText);

        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error("Invalid response format");
        }

        return res.status(200).json(data);
      } catch (parseError) {
        console.error("Parse error:", parseError, "Raw text:", text);
        return res.status(500).json({
          message: "Failed to parse AI response",
          error: parseError.message
        });
      }
    } catch (aiError) {
      console.error("AI Error:", aiError);
      return res.status(500).json({
        message: "Failed to generate questions",
        error: aiError.message
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};


/**
 * POST /api/ai/generate-explanation
 */

export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ 
        message: "Missing required field: question" 
      });
    }

    const prompt = `Explain the following interview question / concept in detail: "${question}"
    Return JSON: { "title": "...", "explanation": "..." }`;

    // Create hash for caching
    const promptHash = crypto.createHash('md5').update(prompt).digest('hex');

    // Check cache first
    const cachedResponse = await cache.getCachedAIResponse(promptHash);
    if (cachedResponse) {
      console.log("Returning cached AI explanation");
      return res.json(cachedResponse);
    }

    const modelId = getModelId();
    const model = genAI.getGenerativeModel({ model: modelId });

    const result = await model.generateContent(prompt);
    const rawText = result?.response?.text?.() ?? String(result);

    try {
      const data = JSON.parse(
        rawText
          .replace(/^```json\s*/i, "")
          .replace(/```$/i, "")
          .trim()
      );

      // Cache the successful response
      await cache.setCachedAIResponse(promptHash, data);

      return res.json(data);
    } catch (parseErr) {
      console.warn("AI explanation not JSON, returning raw text");
      const fallbackData = {
        title: question,
        explanation: rawText
      };

      // Cache the fallback response too
      await cache.setCachedAIResponse(promptHash, fallbackData);

      return res.json(fallbackData);
    }
  } catch (error) {
    console.error("Error generating explanation:", error);
    return res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message
    });
  }
};

/**
 * POST /api/ai/generate-bulk-explanation
 */
export const generateBulkExplanation = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: "Missing or empty required field: questions",
      });
    }

    // Create a hash of all questions to use as a cache key
    const questionsHash = crypto.createHash('md5').update(JSON.stringify(questions.sort())).digest('hex');
    const cachedResponse = await cache.getCachedAIResponse(questionsHash);
    if (cachedResponse) {
      console.log("Returning cached bulk AI explanation");
      return res.status(200).json(cachedResponse);
    }

    const explanations = [];
    for (const question of questions) {
        const prompt = `Explain the following interview question / concept in detail: "${question}"
        Return JSON: { "title": "...", "explanation": "..." }`;

        const promptHash = crypto.createHash('md5').update(prompt).digest('hex');
        const singleCached = await cache.getCachedAIResponse(promptHash);

        if (singleCached) {
            explanations.push(singleCached);
            continue;
        }

        try {
            const modelId = getModelId();
            const model = genAI.getGenerativeModel({ model: modelId });
            const result = await model.generateContent(prompt);
            const rawText = result?.response?.text?.() ?? String(result);

            try {
                const data = JSON.parse(rawText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
                await cache.setCachedAIResponse(promptHash, data);
                explanations.push(data);
            } catch (parseErr) {
                const fallbackData = { title: question, explanation: rawText };
                await cache.setCachedAIResponse(promptHash, fallbackData);
                explanations.push(fallbackData);
            }
        } catch (individualError) {
            console.error(`Error generating explanation for question: "${question}"`, individualError.message);
            explanations.push({
                title: question,
                explanation: `Sorry, an error occurred while generating an explanation for this question. Please try again.`,
            });
        }
    }

    const response = { explanations };

    // Cache the entire bulk response
    await cache.setCachedAIResponse(questionsHash, response);

    return res.status(200).json(response);

  } catch (error) {
    // Check for specific Gemini API errors (e.g., invalid key, rate limits)
    if (error.message.includes("API key not valid")) {
      console.error("Gemini API key is invalid:", error.message);
      return res.status(401).json({ message: "AI API key is invalid. Please check your server configuration." });
    }

    console.error("Error generating bulk explanation:", error);
    return res.status(500).json({ message: "Failed to generate bulk explanation", error: error.message });
  }
};