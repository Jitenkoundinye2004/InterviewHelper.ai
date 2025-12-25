import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";


const CreateSessionForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        role: "",
        experience: "",
        topicsToFocus: "",
        description: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            console.log("Generating questions...");
            const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
                role: formData.role,
                experience: parseInt(formData.experience),
                topicsToFocus: formData.topicsToFocus,
                numberOfQuestions: 10
            }, {
                timeout: 60000 // 60 seconds for AI generation
            });

            if (aiResponse.data?.questions) {
                // Create session with generated questions
                const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
                    ...formData,
                    experience: parseInt(formData.experience),
                    questions: aiResponse.data.questions
                });

                if (response.data.success) {
                    toast.success("Session created successfully!");
                    if (onSuccess) onSuccess();
                    navigate(`/interview-prep/${response.data.session._id}`);
                }
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            const errorMessage = error.code === 'ECONNABORTED' ? "Request timed out. Please try again." : (error.response?.data?.message || "Failed to create session");
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Start a New Interview Journey
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Fill out a few quick details and unlock your personalized set of
                    interview questions!
                </p>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
                <Input
                    value={formData.role}
                    onChange={({ target }) => handleChange("role", target.value)}
                    label="Target Role"
                    placeholder="e.g., Frontend Developer, UI/UX Designer, etc."
                    type="text"
                />

                <Input
                    value={formData.experience}
                    onChange={({ target }) => handleChange("experience", target.value)}
                    label="Years of Experience"
                    placeholder="e.g., 1 year, 3 years, 5+ years"
                    type="number"
                />

                <Input
                    value={formData.topicsToFocus}
                    onChange={({ target }) => handleChange("topicsToFocus", target.value)}
                    label="Topics to Focus On"
                    placeholder="Comma-separated, e.g., React, Node.js, MongoDB"
                    type="text"
                />

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Creating Session...
                        </div>
                    ) : (
                        "Create Session"
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateSessionForm;
