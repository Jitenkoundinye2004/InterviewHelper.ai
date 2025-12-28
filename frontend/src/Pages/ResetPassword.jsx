    import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Trim inputs
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();
        
        // Password validation
        if (!trimmedPassword) {
            setError("Password is required.");
            toast.error("Password is required.");
            return;
        }

        if (trimmedPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        if (!/[A-Z]/.test(trimmedPassword)) {
            setError("Password must contain at least one uppercase letter.");
            toast.error("Password must contain at least one uppercase letter.");
            return;
        }

        if (!/[a-z]/.test(trimmedPassword)) {
            setError("Password must contain at least one lowercase letter.");
            toast.error("Password must contain at least one lowercase letter.");
            return;
        }

        if (!/[0-9]/.test(trimmedPassword)) {
            setError("Password must contain at least one number.");
            toast.error("Password must contain at least one number.");
            return;
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            setError("Passwords do not match.");
            toast.error("Passwords do not match.");
            return;
        }
        
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD(token), { password: trimmedPassword });
            setMessage(response.data.message);
            toast.success(response.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Reset Your Password</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">New Password (min. 8 chars, 1 uppercase, 1 lowercase, 1 number)</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); if (error) setError(''); }}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {error && <p className="text-sm text-center text-red-600">{error}</p>}
                    {message && <p className="text-sm text-center text-green-600">{message}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;