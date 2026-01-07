import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import path from "path"
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js"
import { fileURLToPath } from "url";
import authRoute from "./routes/authRoute.js"
import sessionRoute from "./routes/sessionRoute.js"
import QuestionRoute from "./routes/questionRoute.js"
import { protect } from "./middleware/authMiddleware.js";
import { generateConceptExplanation, generateInterviewQuestions, generateBulkExplanation } from "./controllers/aiController.js";
import redis from "./config/redis.js";
import mockInterviewRoute from "./routes/mockInterviewRoute.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import helmet from "helmet";

const app = express();

// Security headers (relax COOP/COEP for OAuth popups and postMessage)
// Relax COOP/COEP to allow OAuth popups and cross-window messaging
app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
}));

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
const allowedOrigins = [
    'https://interviewhelper-ai-frontend.onrender.com',
    'https://interviewhelper-ai.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000'
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

connectDB();

// Database connection check middleware
const checkDBConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database connection not available. Please try again later.',
            error: 'SERVICE_UNAVAILABLE'
        });
    }
    next();
};

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
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        status: 'OK',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Routes - Apply DB check middleware to routes that need database
app.use("/api/auth", checkDBConnection, authRoute);
app.use("/api/sessions", checkDBConnection, sessionRoute);
app.use("/api/questions", checkDBConnection, QuestionRoute);
app.use("/api/mock-interviews", checkDBConnection, mockInterviewRoute);


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
