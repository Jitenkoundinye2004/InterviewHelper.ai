import React, { useEffect } from 'react';
import { LuX } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const Drawer = ({ isOpen, onClose, title, children }) => {

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full md:w-[600px] lg:w-[700px] bg-white shadow-2xl flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex-none flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title || "Concept Explanation"}</h2>
                <p className="text-sm text-gray-500 mt-0.5">AI-powered detailed focused learning</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
                aria-label="Close panel"
              >
                <LuX className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area - Scrollable */}
            <div
              className="flex-1 overflow-y-auto p-6 scroll-smooth"
              data-lenis-prevent
            >
              <div className="max-w-none pb-10">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
