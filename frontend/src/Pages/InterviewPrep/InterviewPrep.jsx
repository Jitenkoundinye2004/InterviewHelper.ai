import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "../../components/RoleInfoHeader";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import QuestionCard from '../../components/Cards/QuestionCard';
import AIResponsePreview from './components/AIResponsePreview';
import Drawer from '../../components/Drawer';
import SkeletonLoader from '../../components/Loader/SkeletonLoader';
import { LuListCollapse } from 'react-icons/lu';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';


const InterviewPrepPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [sessionData, setSessionData] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const [openLeanWordDrawer, setOpenLeanWordDrawer] = useState(false);
    const [explanation, setExplanation] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdateLoader, setIsUpdateLoader] = useState(false);

    const fetchSessionDetailsById = async () => {
        try {
            setIsLoading(true);
            console.log("Fetching session data for sessionId:", sessionId);

            const response = await axiosInstance.get(
                API_PATHS.SESSION.GET_ONE(sessionId)
            );

            console.log("API Response:", response.data);

            if (response.data && response.data.session) {
                console.log("Setting session data:", response.data.session);
                console.log("Questions in session:", response.data.session.questions);
                setSessionData(response.data.session);
            } else {
                console.log("No session data found in response");
                setErrorMsg("No session data found.");
            }
        } catch (error) {
            console.error("Error fetching session data: ", error);
            console.error("Error response:", error.response);

            if (error.response?.status === 400) {
                setErrorMsg("Invalid session ID.");
            } else if (error.response?.status === 404) {
                setErrorMsg("Session not found.");
            } else if (error.response?.status === 401) {
                setErrorMsg("You are not authorized to access this session.");
            } else {
                setErrorMsg(
                    `Failed to load session data: ${error.response?.data?.message || error.message
                    }`
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const generateConceptExplanation = async (question) => {
        try {
            setErrorMsg("")
            setExplanation(null)
            setIsLoading(true);
            setOpenLeanWordDrawer(true);
            const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, { concept: question });

            if (response.data) {
                setExplanation(response.data)
            }
        } catch (error) {
            setExplanation(null)
            setErrorMsg("Failed to generate explanation, Try again later")
            console.error("Error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleQuestionPinStatus = async (questionId) => {
        try {
            const response = await axiosInstance.post(
                API_PATHS.QUESTION.PIN(questionId)
            );
            console.log(response);

            if (response.data && response.data.question) {
                fetchSessionDetailsById();
            }

        } catch (error) {
            console.error("Error:", error);

        }
    };

    const uploadMoreQuestions = async () => {
        try {
            setIsUpdateLoader(true);
            setErrorMsg(""); // Clear any previous errors

            console.log("Generating questions with:", {
                role: sessionData?.role,
                experience: sessionData?.experience,
                topicsToFocus: sessionData?.topicsToFocus,
                numberOfQuestions: 10,
            });

            const aiResponsePromise = axiosInstance.post(
                API_PATHS.AI.GENERATE_QUESTIONS,
                {
                    role: sessionData?.role,
                    experience: sessionData?.experience,
                    topicsToFocus: sessionData?.topicsToFocus,
                    numberOfQuestions: 10,
                }
            );

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Question generation timed out')), 45000)
            );

            const aiResponse = await Promise.race([aiResponsePromise, timeoutPromise]);

            console.log("AI Response:", aiResponse.data);
            const generatedQuestions = aiResponse.data.questions;

            if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
                throw new Error("No questions were generated. Please try again.");
            }

            console.log("Generated questions:", generatedQuestions);
            console.log("SessionId:", sessionId);

            const response = await axiosInstance.post(
                API_PATHS.QUESTION.ADD_TO_SESSION,
                {
                    sessionId,
                    questions: generatedQuestions,
                }
            );

            if (response.data) {
                toast.success(`Successfully added ${generatedQuestions.length} more Q&A!`);
                fetchSessionDetailsById();
            }
        } catch (error) {
            console.error("Error in uploadMoreQuestions:", error);

            let errorMessage = "Something went wrong. Please try again";

            if (error.message === 'Question generation timed out') {
                errorMessage = "Question generation is taking too long. Please try again.";
            } else if (error.response?.status === 500) {
                errorMessage = "Server error occurred. Please try again later.";
            } else if (error.response?.status === 400) {
                errorMessage = "Invalid request. Please check your session data.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = "Request timed out. Please check your connection and try again.";
            }

            setErrorMsg(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsUpdateLoader(false);
        }
    }

    useEffect(() => {
        if (sessionId) {
            fetchSessionDetailsById();
        }
        return () => { }
    }, [sessionId]);

    return (
        <DashboardLayout>
            <RoleInfoHeader
                role={sessionData?.role || ""}
                topicsToFocus={sessionData?.topicsToFocus || ""}
                experience={sessionData?.experience || "-"}
                questions={sessionData?.questions?.length || "-"}
                description={sessionData?.description || ""}
                lastUpdated={
                    sessionData?.updatedAt
                        ? moment(sessionData.updatedAt).format("Do MMM YYYY")
                        : ""
                }
            />
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl font-bold text-gray-800 mb-8">Interview Q & A</h2>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg shadow-sm">
                        <p className="text-red-700 font-medium flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Error: {errorMsg}
                        </p>
                    </div>
                )}

                {isLoading && (
                    <div className="mb-6 p-4 bg-blue-100 border border-red-300 rounded-lg shadow-sm">
                        <p className="text-blue-700 font-medium flex items-center gap-2">
                            <SpinnerLoader className="w-5 h-5" /> Loading session data...
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-8">
                    <div className={`col-span-12 transition-all duration-300 ease-in-out ${openLeanWordDrawer ? "lg:col-span-8" : "lg:col-span-12"}`} style={{ overflowY: openLeanWordDrawer ? "hidden" : "auto", maxHeight: "calc(100vh - 200px)" }}>
                        <AnimatePresence>
                            {sessionData?.questions?.length === 0 && !isLoading && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No questions found for this session.</p>
                                </div>
                            )}
                            {sessionData?.questions?.map((data, index) => {
                                return (
                                    <motion.div
                                        key={data._id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{
                                            duration: 0.4,
                                            type: "spring",
                                            stiffness: 100,
                                            delay: index * 0.1,
                                            damping: 15,
                                        }}
                                        layout
                                        layoutId={`question-${data._id || index}`}
                                        className="mb-4 p-5 bg-white rounded-xl shadow-md transform transition-all hover:scale-[1.01] hover:shadow-lg"
                                    >
                                        <QuestionCard
                                            question={data?.question}
                                            answer={data?.answer}
                                            onLearnMore={() =>
                                                generateConceptExplanation(data.question)}
                                            isPinned={data?.isPinned}
                                            onTogglePin={() => toggleQuestionPinStatus(data._id)}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {!isLoading && sessionData?.questions?.length > 0 && (
                            <div className="flex items-center justify-center mt-8">
                                <button
                                    className="flex items-center gap-2 px-8 py-3 text-sm font-medium text-white bg-gray-900 rounded-full shadow-lg hover:bg-gray-700 hover:shadow-xl transform transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading || isUpdateLoader}
                                    onClick={uploadMoreQuestions}
                                >
                                    {isUpdateLoader ? (
                                        <SpinnerLoader className="w-4 h-4 text-white" />
                                    ) : (
                                        <LuListCollapse className="w-5 h-5" />
                                    )}
                                    <span className="text-nowrap">{isUpdateLoader ? "Generating..." : "Load More"}</span>
                                </button>
                            </div>
                        )}
                    </div>
                    {openLeanWordDrawer && (
                        <div className="col-span-12 lg:col-span-4 transition-all duration-300 ease-in-out">
                            <Drawer
                                isOpen={openLeanWordDrawer}
                                onClose={() => setOpenLeanWordDrawer(false)}
                                title={!isLoading && explanation?.title}
                            >
                                {errorMsg && (
                                    <p className="flex gap-2 text-sm text-red-600 font-medium">
                                        <AlertCircle className="mt-1" /> {errorMsg}
                                    </p>
                                )}
                                {isLoading && <SkeletonLoader />}
                                {!isLoading && explanation && (
                                    <AIResponsePreview content={explanation?.explanation} />
                                )}
                            </Drawer>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default InterviewPrepPage;
