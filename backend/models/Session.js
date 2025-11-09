

// models/sessionModel.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    experience: { type: Number, required: true },
    topicsToFocus: { type: String, required: true },
    description: { type: String },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // array of question ObjectIds
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to user
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
