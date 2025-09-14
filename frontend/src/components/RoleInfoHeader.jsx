import React from "react";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  exReference, // This prop seems unused in the original code, but I've kept it.
  questions,
  description, // This prop seems unused in the original code, but I've kept it.
  lastUpdated,
}) => {
  return (
    <div className="bg-white relative py-8 md:py-12 overflow-hidden shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 md:mb-6">
            <div className="flex-grow">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {role}
              </h1>
              <p className="text-sm md:text-base font-medium text-gray-600 mt-1">
                {topicsToFocus}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Experience Tag */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900 rounded-full transition-all duration-300 hover:bg-gray-700 hover:shadow-md cursor-pointer">
              <span className="text-xs font-semibold text-white">
                Experience:
              </span>
              <span className="text-xs font-medium text-gray-200">
                {experience} {experience == 1 ? "Year" : "Years"}
              </span>
            </div>

            {/* Questions Tag */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900 rounded-full transition-all duration-300 hover:bg-gray-700 hover:shadow-md cursor-pointer">
              <span className="text-xs font-semibold text-white">
                Q&A:
              </span>
              <span className="text-xs font-medium text-gray-200">
                {questions}
              </span>
            </div>

            {/* Last Updated Tag */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900 rounded-full transition-all duration-300 hover:bg-gray-700 hover:shadow-md cursor-pointer">
              <span className="text-xs font-semibold text-white">
                Last Updated:
              </span>
              <span className="text-xs font-medium text-gray-200">
                {lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Blob Background Section */}
      <div className="w-full md:w-[40vw] lg:w-[30vw] h-full flex items-center justify-center absolute top-0 right-0 pointer-events-none">
        <div className="w-24 h-24 bg-lime-400 opacity-60 rounded-full mix-blend-multiply filter blur-2xl animate-blob1" />
        <div className="w-24 h-24 bg-teal-400 opacity-60 rounded-full mix-blend-multiply filter blur-2xl animate-blob2">
          <div className="w-24 h-24 bg-cyan-400 opacity-60 rounded-full mix-blend-multiply filter blur-2xl animate-blob3">
            <div className="w-24 h-24 bg-fuchsia-400 opacity-60 rounded-full mix-blend-multiply filter blur-2xl animate-blob1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;