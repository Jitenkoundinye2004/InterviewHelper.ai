import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LandingPage from "./Pages/LandingPage";
import Dashboard from "./Pages/Home/Dashboard";
import InterviewPrepPage from "./Pages/InterviewPrep/InterviewPrep";
import MockInterviewPage from "./Pages/MockInterview/MockInterview";
import SignUp from "./Pages/Auth/SignUp";

import { UserContext } from "./context/userContext";
import Lenis from "lenis";
import 'lenis/dist/lenis.css';

const App = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<SignUp />} />

        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/interview-prep/:sessionId" element={user ? <InterviewPrepPage /> : <Navigate to="/" />} />
        <Route path="/mock-interview/new" element={user ? <MockInterviewPage /> : <Navigate to="/" />} />
        <Route path="/mock-interview/:sessionId" element={user ? <MockInterviewPage /> : <Navigate to="/" />} />
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default App;