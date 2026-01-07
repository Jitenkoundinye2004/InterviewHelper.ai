import React, { useState } from "react";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-gray-100 transition-all">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center relative">
        <Link to="/dashboard" className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-blue-500/30 shadow-lg">
            I
          </div>
          <span className="text-base sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            InterviewHelper.ai
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/mock-interview/new" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Mock Interview
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          aria-label="Open menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Profile */}
        <div className="hidden sm:block">
          <ProfileInfoCard />
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="absolute right-3 top-14 sm:hidden bg-white border border-gray-200 rounded-xl shadow-lg w-48 py-2 z-50">
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/mock-interview/new"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              Mock Interview
            </Link>
            <div className="border-t border-gray-100 my-1" />
            <Link
              to="/"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
