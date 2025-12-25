import React from 'react';
import { motion } from 'framer-motion';
import { User, Mic, Video, MessageSquare, CheckCircle2, Code2, Sparkles } from 'lucide-react';

const InterviewAnimation = () => {
    return (
        <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
            {/* Abstract Background Blobs */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl absolute"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-3xl absolute"
                />
            </div>

            {/* Main Container - The "Screen" */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-6 overflow-hidden"
            >
                {/* Header Bar */}
                <div className="flex items-center justify-between mb-6 opacity-80">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex items-center space-x-2 bg-white/50 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Live Interview</span>
                    </div>
                </div>

                {/* Video Feeds Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6 relative">

                    {/* Interviewer Feed */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 aspect-video relative overflow-hidden ring-1 ring-indigo-100"
                    >
                        <div className="absolute top-3 right-3 bg-black/20 text-white p-1.5 rounded-lg backdrop-blur-sm">
                            <Mic size={14} />
                        </div>
                        <div className="flex flex-col items-center justify-center h-full space-y-3">
                            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-200 to-blue-200 rounded-full flex items-center justify-center shadow-inner">
                                <User className="text-white w-8 h-8" />
                            </div>
                            <div className="space-y-1.5 w-full max-w-[80%]">
                                <div className="h-2 bg-indigo-200/50 rounded-full w-full animate-pulse" />
                                <div className="h-2 bg-indigo-200/50 rounded-full w-3/4" />
                            </div>
                        </div>
                        {/* Speech Bubble */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, repeat: Infinity, repeatDelay: 3, duration: 2 }}
                            className="absolute -top-2 left-4 bg-white px-3 py-2 rounded-xl rounded-bl-none shadow-lg border border-indigo-50 text-xs text-indigo-800 font-medium z-20"
                        >
                            Tell me about React hooks?
                        </motion.div>
                    </motion.div>

                    {/* Candidate Feed (User) */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-900 rounded-2xl p-4 aspect-video relative overflow-hidden group ring-1 ring-gray-800"
                    >
                        <div className="absolute top-3 right-3 bg-white/10 text-white p-1.5 rounded-lg backdrop-blur-sm">
                            <Video size={14} />
                        </div>
                        <div className="flex flex-col items-center justify-center h-full space-y-3">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">You</span>
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute inset-0 bg-blue-400 rounded-full z-[-1]"
                                />
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* AI Analysis Floating Card */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-blue-100 flex items-center gap-3 z-30 max-w-[200px]"
                >
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">AI Analysis</p>
                        <p className="text-xs text-gray-800 font-medium">Strong answer structure!</p>
                    </div>
                </motion.div>

                {/* Tech Stack Floating Icons */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-100"
                >
                    <Code2 size={20} className="text-blue-500" />
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/3 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-100"
                >
                    <CheckCircle2 size={20} className="text-green-500" />
                </motion.div>

            </motion.div>
        </div>
    );
};

export default InterviewAnimation;
