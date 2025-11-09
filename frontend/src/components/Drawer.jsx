import React from 'react';
import { LuX } from 'react-icons/lu';
const Drawer = ({ isOpen, onClose, title, children }) => {
<<<<<<< HEAD
  return (
    <div
      className={`fixed top-[64px] right-0 z-40 h-[calc(100dvh-64px)] overflow-y-auto transition-transform bg-white w-full md:w-[40vw] shadow-lg border-l ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-semibold text-gray-900">{title}</h5>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <LuX className="w-5 h-5 text-gray-500" />
          </button>
=======
    return (
        <div
            className={`fixed top-[64px] right-0 z-40 h-[calc(100dvh-64px)] p-4 overflow-y-auto transition-transform bg-white w-full md:w-[40vw] shadow-cyan-800/10 border-l-gray-200 ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            tabIndex={-1}
            aria-labelledby="drawer-right-label"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h5 id="drawer-right-label" className="flex items-center text-base font-semibold text-black">
                    {title}
                </h5>
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center"
                >
                    <LuX className="w-5 h-5" />
                </button>
            </div>

            {/* Children content */}
            {children}
>>>>>>> 5e506d1fb0f2d5b3963692aaecb14d5ff050bcfa
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Drawer;
