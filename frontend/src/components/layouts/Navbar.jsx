import React from "react";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-gray-100 transition-all">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-blue-500/30 shadow-lg">
            I
          </div>
          <span className="text-base sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            InterviewHelper.ai
          </span>
        </Link>

        <ProfileInfoCard />
      </div>
    </div>
  );
};

export default Navbar;
