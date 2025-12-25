import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import crypto from "crypto";
import cache from "../utils/cache.js";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to get model ID
const getModelId = () => {
  let modelEnv = (process.env.GEMINI_MODEL || "").trim();
  if (!modelEnv) modelEnv = "gemini-1.5-flash"; // default model - faster for quick responses
  return modelEnv;
};

export const generateInterviewQuestions = async (req, res) => {
  try {
    console.log("Starting question generation...");

    const { role, experience, topicsToFocus, numberOfQuestions = 10 } = req.body;

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

      if (aiError.status === 429 || (aiError.message && aiError.message.includes("429"))) {
        return res.status(429).json({
          message: "You have exceeded the API request limit (Quota Exceeded). Please wait a few minutes or use a different API Key.",
          error: "QUOTA_EXCEEDED"
        });
      }

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

    // Check for rate limit error (status code 429)
    if (error.status === 429 || (error.message && error.message.includes("429"))) {
      return res.status(429).json({ message: "You have exceeded the API request limit. Please try again later." });
    }

    return res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message
    });
  }
};

// Helper function to introduce a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const BATCH_SIZE = 5; // Number of questions to process in one chunk
const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay
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
    // Process questions in batches 
    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
      const batch = questions.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${i / BATCH_SIZE + 1} (size: ${batch.length})...`);

      // Check if we have individual cache for ALL items in this batch
      // Optimization: If 4 out of 5 are cached, we still pay for 1 API call for the 5th.
      // For simplicity/speed, we'll just check if we can skip the WHOLE batch or not.
      // But ideally we should filter out cached ones. 
      // Let's filter first.

      const neededQuestions = [];
      const batchResultsMap = {}; // store by question text

      for (const q of batch) {
        const qHash = crypto.createHash('md5').update(`Explain the following interview question / concept in detail: "${q}"
    Return JSON: { "title": "...", "explanation": "..." }`).digest('hex'); // Use consistent hash with single gen
        // Note: The hash key logic above relies on the EXACT string used in generateConceptExplanation.
        // We should probably normalize it, but for now we'll just try to fetch.
        // Actually, let's just generate fresh for bulk to ensure consistency or simpler logic.
        // Or, let's stick to the prompt-based hashing if we want to share cache.
        // To share cache with `generateConceptExplanation`, we'd need to match its prompt structure exactly. 
        // BUT `generateConceptExplanation` uses a specific prompt. 
        // Let's just generate new content for bulk to simplify. The bulk cache (questionsHash) covers repeated downloads.

        neededQuestions.push(q);
      }

      if (neededQuestions.length > 0) {
        try {
          const prompt = `You are an expert interviewer. Provide detailed explanations for the following interview questions.
            
            Questions:
            ${JSON.stringify(neededQuestions)}

            Return a RAW JSON ARRAY of objects. Do not use markdown.
            Format: [{"title": "question text", "explanation": "detailed explanation"}, ...]`;

          const modelId = getModelId();
          const model = genAI.getGenerativeModel({ model: modelId });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          const cleanedText = text.replace(/```json\s*/g, "").replace(/```/g, "").trim();
          const data = JSON.parse(cleanedText);

          if (Array.isArray(data)) {
            explanations.push(...data);
          } else {
            console.warn("Batch AI response was not an array:", data);
            // Fallback: map neededQuestions to error objects
            neededQuestions.forEach(q => explanations.push({ title: q, explanation: "Failed to generate specific explanation." }));
          }

        } catch (batchError) {
          console.error("Error processing batch:", batchError);
          if (batchError.status === 429) throw batchError; // Propagate rate limit
          neededQuestions.forEach(q => explanations.push({ title: q, explanation: "Error retrieving explanation." }));
        }
      }

      // Add a delay before the next batch to respect rate limits
      if (i + BATCH_SIZE < questions.length) {
        await delay(DELAY_BETWEEN_BATCHES);
      }
    }

    const response = { explanations };

    // Cache the entire bulk response
    await cache.setCachedAIResponse(questionsHash, response);

    return res.status(200).json(response);

  } catch (error) {
    if (error.status === 429 || (error.message && error.message.includes("429"))) {
      return res.status(429).json({ message: "Quota Exceeded. Please try again later.", error: "QUOTA_EXCEEDED" });
    }
    console.error("Error generating bulk explanation:", error);
    return res.status(500).json({ message: "Failed to generate bulk explanation", error: error.message });
  }
};