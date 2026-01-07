import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, required: true },
        experience: { type: Number, required: true }, // in years
        topics: { type: String, required: true },
        status: { type: String, enum: ["active", "completed"], default: "active" },
        conversation: [
            {
                role: { type: String, enum: ["ai", "user"], required: true },
                content: { type: String, required: true }, // Question or Answer
                feedback: { type: String }, // Feedback for user answer
                rating: { type: Number }, // AI rating for the answer (1-10)
                timestamp: { type: Date, default: Date.now },
            },
        ],
        overallFeedback: { type: String },
        overallScore: { type: Number },
    },
    { timestamps: true }
);

const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);

export default MockInterview;
