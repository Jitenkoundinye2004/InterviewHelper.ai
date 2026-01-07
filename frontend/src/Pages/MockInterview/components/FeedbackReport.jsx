import React from "react";
import { CheckCircle, AlertTriangle, Star, Trophy, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FeedbackReport = ({ interview }) => {
    if (!interview) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-2">
                    <Trophy className="w-10 h-10 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Interview Completed!</h1>
                <p className="text-gray-500 max-w-lg mx-auto">
                    Great job! Here's a breakdown of your performance during this session.
                </p>
            </motion.div>

            {/* Score Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                                className="text-gray-100"
                                strokeWidth="10"
                                stroke="currentColor"
                                fill="transparent"
                                r="56"
                                cx="64"
                                cy="64"
                            />
                            <circle
                                className="text-blue-600"
                                strokeWidth="10"
                                strokeDasharray={351.86}
                                strokeDashoffset={351.86 - (351.86 * interview.overallScore) / 100}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="56"
                                cx="64"
                                cy="64"
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className="text-2xl font-bold text-gray-900">{interview.overallScore}</span>
                            <span className="text-xs text-gray-500 block">/100</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
                        <p className="text-sm text-gray-500 mt-1">Based on content, clarity, and relevance.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                            <span className="text-xs text-gray-500 block">Duration</span>
                            <span className="font-medium text-gray-900">15 mins</span> {/* Placeholder */}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <div>
                            <span className="text-xs text-gray-500 block">Questions</span>
                            <span className="font-medium text-gray-900">{interview.conversation.filter(c => c.role === 'ai').length} Answered</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Detailed Feedback */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6"
            >
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    Comprehensive Feedback
                </h3>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                    <p className="whitespace-pre-wrap">{interview.overallFeedback}</p>
                </div>
            </motion.div>

            {/* Question Breakdown */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 px-2">Question Breakdown</h3>
                {interview.conversation.filter(c => c.role === 'user' && c.feedback).map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (index * 0.05) }}
                        className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">Question {index + 1}</span>
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-semibold text-gray-900">{item.rating}/10</span>
                            </div>
                        </div>
                        {/* Need to find the question for this answer. Assuming standard flow Q->A->Q->A */}
                        {/* In real app, we might want to structure conversation better or search back */}

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Your Answer:</p>
                                <p className="text-gray-800 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">{item.content}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-emerald-600 mb-1 flex items-center gap-1.5">
                                    <Bot className="w-3.5 h-3.5" />
                                    AI Feedback:
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.feedback}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center pt-8">
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all"
                >
                    Back to Dashboard
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default FeedbackReport;
