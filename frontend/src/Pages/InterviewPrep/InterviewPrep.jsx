import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import jsPDF from 'jspdf';
import { marked } from 'marked';

import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "../../components/RoleInfoHeader";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import QuestionCard from '../../components/Cards/QuestionCard';
import AIResponsePreview from '../../Pages/InterviewPrep/components/AIResponsePreview';
import Drawer from '../../components/Drawer';
import SkeletonLoader from '../../components/Loader/SkeletonLoader';
import { LuDownload, LuListCollapse } from 'react-icons/lu';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import { UserContext } from '../../context/userContext';

// Debounce utility
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};


const InterviewPrepPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const hasFetched = useRef(false);

    const [sessionData, setSessionData] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const [openLeanWordDrawer, setOpenLeanWordDrawer] = useState(false);
    const [explanation, setExplanation] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdateLoader, setIsUpdateLoader] = useState(false);
    const [isPdfLoading, setIsPdfLoading] = useState(false);

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
                toast.error("Session expired. Please log in again.");
                setUser(null);
                localStorage.removeItem("authToken");
                navigate("/");
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
            setErrorMsg("");

            const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
                question: question // Make sure to send the question property
            });

            if (response.data) {
                setExplanation(response.data);
                setOpenLeanWordDrawer(true);
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = error.response?.data?.message || "Failed to generate explanation";
            setErrorMsg(errorMessage);
            // If it's a rate limit error, open the drawer to show the message
            if (error.response?.status === 429) {
                setExplanation({ title: "Rate Limit Exceeded", explanation: errorMessage });
                setOpenLeanWordDrawer(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLearnMore = (question) => {
        generateConceptExplanation(question);
    };

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

    const handleDownloadPdf = async () => {
        if (!sessionData) return;

        setIsPdfLoading(true);
        toast.loading("Generating PDF... This may take a moment.", { id: "pdf-toast" });

        try {
            // Fetch all explanations in a single batch request for speed
            const response = await axiosInstance.post(API_PATHS.AI.GENERATE_BULK_EXPLANATION, {
                questions: sessionData.questions.map(qa => qa.question)
            }, {
                timeout: 0 // Disable timeout for this long-running request
            });

            const detailedAnswers = response.data.explanations;

            toast.loading("Compiling PDF...", { id: "pdf-toast" }
            );
            
            const title = `Interview Prep: ${sessionData.role}`;
            const subtitle = `Experience: ${sessionData.experience} years | Topics: ${sessionData.topicsToFocus}`;

            let htmlString = `
                <style>
                    body { font-family: Helvetica, sans-serif; line-height: 1.6; color: #333; }
                    h1 { font-size: 24px; color: #1a202c; border-bottom: 2px solid #4a90e2; padding-bottom: 10px; margin-bottom: 5px; }
                    h2 { font-size: 18px; color: #2d3748; margin-top: 20px; font-weight: bold; }
                    p { margin-top: 5px; margin-bottom: 10px; }
                    pre { background-color: #f7fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; white-space: pre-wrap; word-wrap: break-word; font-size: 13px; }
                    code { font-family: "Courier New", Courier, monospace; background-color: #edf2f7; padding: 2px 4px; border-radius: 4px; font-size: 90%; }
                    pre code { background-color: transparent; padding: 0; border-radius: 0; }
                    blockquote { border-left: 4px solid #a0aec0; padding-left: 15px; color: #4a5568; font-style: italic; margin-left: 0; }
                    ul, ol { padding-left: 25px; margin-bottom: 10px; }
                    li { margin-bottom: 5px; }
                    hr { border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0; }
                    .subtitle { font-size: 12px; color: #718096; margin-bottom: 20px; }
                    .qa-block { margin-bottom: 20px; page-break-inside: avoid; }
                </style>
                <h1>${title}</h1>
                <p class="subtitle">${subtitle}</p>
            `;

            for (let i = 0; i < sessionData.questions.length; i++) {
                const qa = sessionData.questions[i];
                const detailedAnswer = detailedAnswers[i]?.explanation || qa.answer;
                const answerHtml = marked(detailedAnswer, { breaks: true });

                htmlString += `
                    <div class="qa-block">
                        <h2>Q${i + 1}: ${qa.question}</h2>
                        <div>${answerHtml}</div>
                    </div>
                    ${i < sessionData.questions.length - 1 ? '<hr />' : ''}
                `;
            }

            const doc = new jsPDF();
            await doc.html(htmlString, {
                x: 15,
                y: 15,
                width: 180,
                windowWidth: 800,
                callback: function (docInstance) {
                    const pageCount = docInstance.internal.getNumberOfPages();
                    for (let i = 1; i <= pageCount; i++) {
                        docInstance.setPage(i);
                        docInstance.setFontSize(10);
                        docInstance.setTextColor(150);
                        docInstance.text(
                            `Page ${i} of ${pageCount}`,
                            docInstance.internal.pageSize.getWidth() - 20,
                            docInstance.internal.pageSize.getHeight() - 10,
                            { align: 'right' }
                        );
                    }
                    docInstance.save(`${sessionData.role.replace(/\s+/g, '_')}_interview_prep.pdf`);
                }
            });

            toast.success("PDF downloaded successfully!", { id: "pdf-toast" });
        } catch (error) {
            console.error("Error generating PDF:", error);
            const errorMessage = error.response?.data?.message || "Failed to generate detailed PDF.";
            toast.error(errorMessage, { id: "pdf-toast" });
        } finally {
            setIsPdfLoading(false);
        }
    };




    

    useEffect(() => {
        if (sessionId) {
            if (!hasFetched.current) {
                fetchSessionDetailsById();
                hasFetched.current = true;
            }
        }
        return () => { hasFetched.current = false; }
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
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-gray-800">Interview Q & A</h2>
                    <button
                        onClick={handleDownloadPdf}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm hover:bg-gray-700 disabled:opacity-50"
                        disabled={!sessionData || sessionData.questions.length === 0 || isLoading || isPdfLoading}
                    >
                        {isPdfLoading ? (
                            <SpinnerLoader className="w-4 h-4 text-white" />
                        ) : (
                            <LuDownload className="w-4 h-4" />
                        )}
                        {isPdfLoading ? "Generating..." : "Download PDF"}
                    </button>
                </div>

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
                            <SpinnerLoader className="w-5 h-5" />
                            Loading...
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-8">
                    <div className={`col-span-12 transition-all duration-300 ease-in-out`} style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
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
                                        className="mb-4"
                                    >
                                        <QuestionCard
                                            key={data._id}
                                            question={data.question}
                                            answer={data.answer}
                                            isPinned={data.isPinned}
                                            onTogglePin={() => toggleQuestionPinStatus(data._id)}
                                            onLearnMore={() => handleLearnMore(data.question)}
                                            isDrawerOpen={openLeanWordDrawer}
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
                </div>
                <AnimatePresence>
                    {openLeanWordDrawer && (
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
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    )
}

export default InterviewPrepPage;
