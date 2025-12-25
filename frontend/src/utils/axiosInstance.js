// src/utils/axiosInstance.js
import axios from "axios";

const baseURL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 60000, // Increased timeout for AI generation requests
  withCredentials: true,
  retry: 3, // Number of retry attempts
  retryDelay: 1000, // Delay between retries in ms
});

// Request interceptor for retry logic
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor with retry logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config) return Promise.reject(error);

    // Get retry config from axios instance defaults
    const retry = config.retry || axiosInstance.defaults.retry;
    const retryDelay = config.retryDelay || axiosInstance.defaults.retryDelay;

    if (!retry) return Promise.reject(error);

    // Retry logic for network errors and 5xx status codes
    if (error.code === 'ERR_NETWORK' || (error.response && error.response.status >= 500)) {
      config.retryCount = config.retryCount || 0;

      if (config.retryCount < retry) {
        config.retryCount += 1;
        const delay = retryDelay * config.retryCount;



        return new Promise(resolve => setTimeout(() => resolve(axiosInstance(config)), delay));
      }
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Is the backend server running?');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
