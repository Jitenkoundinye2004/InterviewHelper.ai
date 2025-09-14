import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import path from "path"
import { connectDB } from "./config/db.js"
import { fileURLToPath } from "url";
import authRoute from "./routes/authRoute.js"
import sessionRoute from "./routes/sessionRoute.js"
import QuestionRoute from "./routes/questionRoute.js"
import { protect } from "./middleware/authMiddleware.js";
import { generateConceptExplanation, generateInterviewQuestions } from "./controllers/aiController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app =express()


//middleware to handle CORS
app.use(
    cors({
        origin: ["https://interviewhelper-ai-frontend.onrender.com", "http://localhost:5173", "http://localhost:3000"],
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
        credentials: true
    })
);
 

connectDB();

//Middleware

app.use(express.json());

// Error handling middleware for JSON parsing
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
    }
    next();
});

//Routes

app.use("/api/auth",authRoute);
app.use("/api/sessions",sessionRoute);


app.use("/api/questions",QuestionRoute);

// AI Routes
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);


//server upload folder

app.use("/uploads",express.static(path.join(__dirname,"uploads"),{}));

// start Server

const port = process.env.PORT || 8000;

app.listen(port,()=>{console.log(`Server is running on ${port}`);
})