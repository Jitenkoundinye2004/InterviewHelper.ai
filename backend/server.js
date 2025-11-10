import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import path from "path"
import compression from "compression";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js"
import { fileURLToPath } from "url";
import authRoute from "./routes/authRoute.js"
import sessionRoute from "./routes/sessionRoute.js"
import QuestionRoute from "./routes/questionRoute.js"
import { protect } from "./middleware/authMiddleware.js";
import { generateConceptExplanation, generateInterviewQuestions, generateBulkExplanation } from "./controllers/aiController.js";
import redis from "./config/redis.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Compression middleware to reduce response sizes
app.use(compression());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// CORS middleware
app.use(
    cors({
        origin: ['https://interviewhelper-ai-frontend.onrender.com', 'https://interviewhelper-ai.onrender.com'],
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
        credentials: true
    })
);

connectDB();

// Middleware
app.use(express.json({ limit: '10mb' })); // Increase limit for large payloads

// Error handling middleware for JSON parsing
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
    }
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/sessions", sessionRoute);
app.use("/api/questions", QuestionRoute);

// AI Routes
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);
app.post("/api/ai/generate-bulk-explanation", protect, generateBulkExplanation);

// Serve upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
