import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Download, Loader2, ListPlus } from "lucide-react";
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
import { UserContext } from '../../context/userContext';

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
            const response = await axiosInstance.get(
                API_PATHS.SESSION.GET_ONE(sessionId)
            );

            if (response.data && response.data.session) {
                setSessionData(response.data.session);
            } else {
                setErrorMsg("No session data found.");
            }
        } catch (error) {
            console.error("Error fetching session data: ", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
                setUser(null);
                navigate("/");
            } else {
                setErrorMsg(error.response?.data?.message || "Failed to load session data.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const generateConceptExplanation = async (question) => {
        try {
            setErrorMsg("");
            setExplanation(null);
            setIsLoading(true);

            const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
                question: question
            });

            if (response.data) {
                setExplanation(response.data);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to generate explanation";
            setErrorMsg(errorMessage);
            if (error.response?.status === 429) {
                setExplanation({ title: "Rate Limit Exceeded", explanation: errorMessage });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLearnMore = (question) => {
        setOpenLeanWordDrawer(true);
        generateConceptExplanation(question);
    };

    const toggleQuestionPinStatus = async (questionId) => {
        try {
            await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId));
            fetchSessionDetailsById();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const uploadMoreQuestions = async () => {
        try {
            setIsUpdateLoader(true);
            setErrorMsg("");

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
            const generatedQuestions = aiResponse.data.questions;

            if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
                throw new Error("No questions were generated. Please try again.");
            }

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
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong. Please try again";
            if (error.message === 'Question generation timed out') errorMessage = "Question generation is taking too long.";
            setErrorMsg(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsUpdateLoader(false);
        }
    }

    const handleDownloadPdf = async () => {
        if (!sessionData) return;

        setIsPdfLoading(true);
        toast.loading("Generating PDF...", { id: "pdf-toast" });

        try {
            const response = await axiosInstance.post(API_PATHS.AI.GENERATE_BULK_EXPLANATION, {
                questions: sessionData.questions.map(qa => qa.question)
            }, { timeout: 0 });

            const detailedAnswers = response.data.explanations;
            toast.loading("Compiling PDF...", { id: "pdf-toast" });

            const title = `Interview Prep: ${sessionData.role}`;
            const subtitle = `Experience: ${sessionData.experience} years | Topics: ${sessionData.topicsToFocus}`;

            let htmlString = `
                <style>
                    body { font-family: Helvetica, sans-serif; line-height: 1.6; color: #333; }
                    h1 { font-size: 24px; color: #1a202c; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
                    h2 { font-size: 16px; color: #1e293b; margin-top: 25px; font-weight: bold; background: #f1f5f9; padding: 10px; border-radius: 6px; }
                    p { margin-bottom: 10px; font-size: 14px; }
                    pre { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; white-space: pre-wrap; font-size: 12px; }
                    hr { border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0; }
                    .subtitle { font-size: 12px; color: #64748b; margin-bottom: 30px; }
                    .qa-block { page-break-inside: avoid; }
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
                `;
            }

            const doc = new jsPDF();
            await doc.html(htmlString, {
                x: 15, y: 15, width: 180, windowWidth: 800,
                callback: function (docInstance) {
                    docInstance.save(`${sessionData.role.replace(/\s+/g, '_')}_interview_prep.pdf`);
                }
            });

            toast.success("PDF downloaded successfully!", { id: "pdf-toast" });
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate PDF.", { id: "pdf-toast" });
        } finally {
            setIsPdfLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId && !hasFetched.current) {
            fetchSessionDetailsById();
            hasFetched.current = true;
        }
        return () => { hasFetched.current = false; }
    }, [sessionId]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white">
                <RoleInfoHeader
                    role={sessionData?.role || ""}
                    topicsToFocus={sessionData?.topicsToFocus || ""}
                    experience={sessionData?.experience || "-"}
                    questions={sessionData?.questions?.length || "-"}
                    description={sessionData?.description || ""}
                    lastUpdated={sessionData?.updatedAt ? moment(sessionData.updatedAt).format("Do MMM YYYY") : ""}
                />

                <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Action Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-gray-100 pb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Q&A Session</h2>
                            <p className="text-sm text-gray-500 mt-1">Review and master your generated interview questions.</p>
                        </div>

                        <button
                            onClick={handleDownloadPdf}
                            className={`group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 ${(!sessionData || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!sessionData || isLoading || isPdfLoading}
                        >
                            {isPdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />}
                            {isPdfLoading ? "Generating PDF..." : "Download PDF"}
                        </button>
                    </div>

                    {errorMsg && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <p className="text-red-700 text-sm font-medium">{errorMsg}</p>
                        </div>
                    )}

                    {isLoading && !sessionData ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <SkeletonLoader key={i} />)}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence mode='popLayout'>
                                {sessionData?.questions?.length === 0 ? (
                                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-gray-500 font-medium">No questions found for this session.</p>
                                    </div>
                                ) : (
                                    sessionData?.questions?.map((data, index) => (
                                        <motion.div
                                            key={data._id || index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                            layout
                                        >
                                            <QuestionCard
                                                question={data.question}
                                                answer={data.answer}
                                                isPinned={data.isPinned}
                                                onTogglePin={() => toggleQuestionPinStatus(data._id)}
                                                onLearnMore={() => handleLearnMore(data.question)}
                                            />
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>

                            {/* Load More Button */}
                            {sessionData?.questions?.length > 0 && (
                                <div className="pt-8 flex justify-center">
                                    <button
                                        className="flex items-center gap-2 px-8 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all disabled:opacity-70"
                                        disabled={isUpdateLoader}
                                        onClick={uploadMoreQuestions}
                                    >
                                        {isUpdateLoader ? <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> : <ListPlus className="w-5 h-5 text-blue-600" />}
                                        <span>{isUpdateLoader ? "Generating new questions..." : "Load More Questions"}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <AnimatePresence>
                        {openLeanWordDrawer && (
                            <Drawer
                                isOpen={openLeanWordDrawer}
                                onClose={() => setOpenLeanWordDrawer(false)}
                                title={!isLoading && explanation?.title}
                            >
                                {isLoading ? (
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                    </div>
                                ) : (
                                    explanation && <AIResponsePreview content={explanation?.explanation} />
                                )}
                            </Drawer>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default InterviewPrepPage;
