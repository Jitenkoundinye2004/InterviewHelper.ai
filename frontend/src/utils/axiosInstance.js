// import axios from "axios";
// import { BASE_URL } from "../utils/apiPath.js";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 80000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Request Interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("token");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


// // Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle common errors globally
//     if (error.response) {
//       if (error.response.status === 401) {
//         // Redirect to login page
//         window.location.href = "/"; 
//       } else if (error.response.status === 500) {
//         console.error("Server error. Please try again later.");
//       }
//     } else if (error.code === "ECONNABORTED") {
//       console.error("Request timeout. Please try again.");
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



// src/utils/axiosInstance.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or your auth store
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
