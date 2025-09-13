import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Dashboard from "./Pages/Home/Dashboard";
import InterviewPrepPage from "./Pages/InterviewPrep/InterviewPrep";
import Login from "./Pages/Auth/Login";
import UserProvider from "./context/userContext";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/interview-prep/:sessionId" element={<InterviewPrepPage />} />
            <Route path="/InterviewPrep/:sessionId" element={<InterviewPrepPage />} />
          </Routes>
        </Router>

        <ToastContainer
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  );
};

export default App;
