import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Dashboard from "./Pages/Home/Dashboard";
import InterviewPrepPage from "./Pages/InterviewPrep/InterviewPrep";
import Login from "./Pages/Login";
import SignUp from "./Pages/Auth/SignUp";
import { UserContext } from "./context/userContext";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />

      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/interview-prep/:sessionId" element={user ? <InterviewPrepPage /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;