import React, { useContext, useState } from "react";
import iprep from "../assets/iprep.png";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import { FaUserCheck, FaChartLine, FaStar } from "react-icons/fa";
import { BsFillLightningChargeFill } from "react-icons/bs";
import Modal from "../components/Modal";
import Login from "../Pages/Auth/Login";
import SignUp from "../Pages/Auth/SignUp";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login"); // default login

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="w-full min-h-screen bg-gradient-to-r from-yellow-50 to-white">
        {/* Navbar */}
        <header className="container mx-auto flex justify-between items-center px-6 py-6">
          <div className="text-xl font-bold text-gray-800">
            InterviewHelper.ai
          </div>

          {user ? (
            <ProfileInfoCard />
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition"
              onClick={() => {
                setCurrentPage("login");
                setOpenAuthModal(true);
              }}
            >
              Login / Sign Up
            </button>
          )}
        </header>

        {/* Main hero */}
        <section className="container mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="text-left">
            <span className="inline-flex items-center gap-2 bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
              <LuSparkles /> AI Powered
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-4">
              Ace Interviews with <br />
              <span className="text-blue-500">AI-Powered</span> Learning
            </h1>
            <p className="text-gray-600 mb-6 max-w-md">
              Get role-specific questions, expand answers when you need them,
              dive deeper into concepts, and organize everything your way.
              From preparation to mastery — your ultimate interview toolkit is here.
            </p>
            <button
              className="bg-blue-500 text-white font-medium px-6 py-3 rounded-full hover:bg-blue-600 transition"
              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>

          {/* Right Side Image */}
          <div className="flex justify-center">
            <img
              src={iprep}
              alt="Interview Prep"
              className="w-full max-w-lg rounded-lg shadow-lg"
            />
          </div>
        </section>
      </div>

      {/* How It Works Section */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            ⚙ How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg border border-gray-100 transition text-center">
              <BsFillLightningChargeFill className="text-yellow-500 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">1️⃣ Input Your Needs</h3>
              <p className="text-gray-600">
                Tell us about the job role, industry, and topics you want to focus on.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg border border-gray-100 transition text-center">
              <LuSparkles className="text-blue-500 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">2️⃣ Get Customized Questions</h3>
              <p className="text-gray-600">
                Our AI instantly generates relevant questions tailored to your preferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg border border-gray-100 transition text-center">
              <FaChartLine className="text-green-500 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">3️⃣ Practice and Improve</h3>
              <p className="text-gray-600">
                Answer questions, track progress, and receive feedback to build confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What You’ll Gain Section */}
      <div className="w-full bg-[#FFF8F0] py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            🎯 What You’ll Gain
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl border border-amber-100 transition text-center">
              <FaUserCheck className="text-blue-500 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">✅ Boost Your Confidence</h3>
              <p className="text-gray-600">
                Walk into your next interview fully prepared and stress-free.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl border border-amber-100 transition text-center">
              <FaStar className="text-yellow-500 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">✅ Improve Your Skills</h3>
              <p className="text-gray-600">
                Develop the right skills and knowledge through guided practice.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl border border-amber-100 transition text-center">
              <FaChartLine className="text-green-500 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">✅ Increase Your Chances</h3>
              <p className="text-gray-600">
                Stand out from the competition and maximize your chances of getting hired.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center p-6">
        Made with ❤ Happy Coding
      </footer>

      {/* Auth Modal */}
      <Modal isOpen={openAuthModal} onClose={() => setOpenAuthModal(false)} hideHider>
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
