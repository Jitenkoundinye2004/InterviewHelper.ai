import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BrainCircuit, Play, ArrowLeft, StopCircle } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import ChatInterface from "./components/ChatInterface";
import FeedbackReport from "./components/FeedbackReport";

const MockInterviewPage = () => {
    const navigate = useNavigate();
    const { sessionId } = useParams();

    // State for setup form
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [topics, setTopics] = useState("");

    // State for interview process
    const [activeSession, setActiveSession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isEnding, setIsEnding] = useState(false);

    // Fetch session if ID is present
    useEffect(() => {
        const fetchSession = async () => {
            if (!sessionId) return;
            try {
                setIsLoading(true);
                const response = await axiosInstance.get(API_PATHS.MOCK_INTERVIEW.GET(sessionId));
                setActiveSession(response.data);
            } catch (error) {
                toast.error("Failed to load interview session.");
                navigate("/mock-interview/new");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSession();
    }, [sessionId, navigate]);

    const handleStartInterview = async (e) => {
        e.preventDefault();
        if (!role || !experience || !topics) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosInstance.post(API_PATHS.MOCK_INTERVIEW.START, {
                role,
                experience: Number(experience),
                topics,
            });

            setActiveSession(response.data);
            navigate(`/mock-interview/${response.data._id}`);
            toast.success("Interview started! Good luck.");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to start interview.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (message) => {
        if (!activeSession) return;

        try {
            setIsSending(true);
            // Optimistic update (optional, but good for UX - though ChatInterface handles it nicely via props too)

            const response = await axiosInstance.post(API_PATHS.MOCK_INTERVIEW.CHAT(activeSession._id), {
                answer: message
            });

            setActiveSession(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    const handleEndInterview = async () => {
        if (!window.confirm("Are you sure you want to end the interview?")) return;

        try {
            setIsEnding(true);
            const response = await axiosInstance.post(API_PATHS.MOCK_INTERVIEW.END(activeSession._id));
            setActiveSession(response.data);
            toast.success("Interview completed successfully!");
        } catch (error) {
            console.error(error); // Keep console error for debugging
            toast.error("Failed to end interview.");
        } finally {
            setIsEnding(false);
        }
    };

    // Render Setup Form
    if (!sessionId && !activeSession) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-white">
                    <div className="container mx-auto py-8 px-4 max-w-2xl">
                        <div className="mb-8 text-center space-y-2">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200">
                                <BrainCircuit className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Mock Interview</h1>
                            <p className="text-gray-500">
                                Practice with our advanced AI interviewer. Get real-time feedback and improve your confidence.
                            </p>
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
                            <form onSubmit={handleStartInterview} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Role</label>
                                    <input
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="e.g. Senior React Developer"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                                    <input
                                        type="number"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="e.g. 5"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                        min="0"
                                        max="50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Topics to Focus On</label>
                                    <textarea
                                        value={topics}
                                        onChange={(e) => setTopics(e.target.value)}
                                        placeholder="e.g. React Hooks, Performance Optimization, System Design"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 min-h-[100px] resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {isLoading ? (
                                        <span>Starting Session...</span>
                                    ) : (
                                        <>
                                            Start Interview
                                            <Play className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Render Interview Interface
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 py-4 px-4 sm:px-6 shadow-sm sticky top-0 z-10">
                    <div className="container mx-auto max-w-5xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500" title="Back to Dashboard">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{activeSession?.role} Interview</h2>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{activeSession?.experience} Years Exp</span>
                                    <span>•</span>
                                    <span className="truncate max-w-[200px]">{activeSession?.topics}</span>
                                </div>
                            </div>
                        </div>

                        {activeSession?.status !== "completed" && (
                            <button
                                onClick={handleEndInterview}
                                disabled={isEnding || isSending}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                            >
                                <StopCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">End Interview</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white">
                    <div className="container mx-auto max-w-5xl p-4 sm:p-6">
                        {isLoading ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading your interview...</p>
                            </div>
                        ) : activeSession?.status === "completed" ? (
                            <FeedbackReport interview={activeSession} />
                        ) : (
                            <ChatInterface
                                conversation={activeSession?.conversation || []}
                                onSendMessage={handleSendMessage}
                                isSending={isSending}
                                isEnding={isEnding}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MockInterviewPage;
