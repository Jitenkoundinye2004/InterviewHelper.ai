import React from "react";

const Modal = ({ children, isOpen, onClose, title, hideHider }) => {
  if (!isOpen) return null; // prevent rendering when closed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-slate-900/60 backdrop-blur-sm p-4 transition-all">
      {/* Modal Content */}
      <div className={`relative flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-md md:max-w-lg lg:max-w-xl transition-all scale-100 ${hideHider ? "p-0" : ""}`}>
        {/* Modal header */}
        {!hideHider && (
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          </div>
        )}

        {/* Close Button - refined positioning and style */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-full text-sm w-9 h-9 flex justify-center items-center transition-colors cursor-pointer z-10"
          onClick={onClose}
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[85vh] w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
