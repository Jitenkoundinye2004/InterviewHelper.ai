import React, { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from 'react-icons/lu';
import AIResponsePreview from '../../Pages/InterviewPrep/components/AIResponsePreview';

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
  isDrawerOpen,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const [rightOffsetPx, setRightOffsetPx] = useState(0);
  const contentRef = useRef(null);

  // Smooth expand/collapse animation and height recalculation
  useEffect(() => {
    if (isExpanded) {
      // Use a timeout to ensure all child content (like AIResponsePreview content)
      // has fully rendered before calculating scrollHeight. This addresses clipping issues.
      const timer = setTimeout(() => {
        const contentHeight = contentRef.current?.scrollHeight || 0;
        setHeight(contentHeight + 12); // Add a small buffer for padding
      }, 50); // Small delay (50ms)
      return () => clearTimeout(timer);
    } else {
      setHeight(0);
    }
  // The height must recalculate if the content changes while expanded
  }, [isExpanded, answer]);

  // Drawer offset logic (responsive margin)
  useEffect(() => {
    const computeOffset = () => {
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const isMdUp = vw >= 768;

      if (isDrawerOpen && isMdUp) {

        // --- 🚨 CRITICAL ADJUSTMENT POINT 🚨 ---
        //
        // The original code assumes the drawer is 40% of the viewport width.
        // IF YOUR DRAWER IS A FIXED PIXEL WIDTH (e.g., 400px),
        // COMMENT OUT THE NEXT TWO LINES AND USE THE ALTERNATIVE BELOW.
        const offset = Math.round(vw * 0.4);
        setRightOffsetPx(offset);

        // --- ALTERNATIVE FOR FIXED WIDTH DRAWER (UNCOMMENT AND ADJUST VALUE IF NEEDED) ---
        // const fixedDrawerWidth = 400; // <-- CHANGE THIS TO YOUR ACTUAL PIXEL WIDTH
        // setRightOffsetPx(fixedDrawerWidth);
        // -----------------------------------------------------------------------------------

      } else {
        setRightOffsetPx(0);
      }
    };
    computeOffset();
    window.addEventListener('resize', computeOffset);
    return () => window.removeEventListener('resize', computeOffset);
  }, [isDrawerOpen]);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  // Apply responsive spacing based on the calculated offset
  const containerStyle = {
    // Adds the drawer width + 20px padding
    marginRight: rightOffsetPx ? `${rightOffsetPx + 20}px` : undefined,
    transition: 'all 0.3s ease',
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden py-5 px-6 shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300"
      style={containerStyle}
    >
      {/* Question Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap md:flex-nowrap">
        {/* Left: Question Label + Text */}
        <div className="flex items-start gap-3 flex-1">
          <span className="text-sm font-semibold text-gray-400 select-none">Q</span>

          <h3
            className="font-semibold text-gray-900 cursor-pointer text-[16px] md:text-[18px] leading-snug hover:text-indigo-700 transition-colors duration-200 flex-1"
            style={{
              lineHeight: '1.5',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
            onClick={toggleExpand}
          >
            {question}
          </h3>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-2 mt-3 md:mt-0 flex-shrink-0">
          {/* Pin Button */}
          <button
            className="flex items-center gap-2 text-xs text-indigo-800 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all duration-200"
            onClick={onTogglePin}
          >
            {isPinned ? (
              <>
                <LuPinOff size={14} />
                <span className="hidden md:block">Unpin</span>
              </>
            ) : (
              <>
                <LuPin size={14} />
                <span className="hidden md:block">Pin</span>
              </>
            )}
          </button>

          {/* Learn More Button */}
          <button
            className="flex items-center gap-2 text-xs text-cyan-800 font-medium bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-100 hover:bg-cyan-100 hover:border-cyan-200 transition-all duration-200"
            onClick={() => {
              setIsExpanded(true);
              onLearnMore(question);
            }}
          >
            <LuSparkles size={14} />
            <span className="hidden md:block">Learn More</span>
          </button>

          {/* Expand/Collapse Icon */}
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={toggleExpand}
          >
            <LuChevronDown
              size={20}
              className={`transform transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Collapsible Answer */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: `${height}px` }}
      >
        <div
          ref={contentRef}
          className="mt-4 text-gray-700 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100"
        >
          <AIResponsePreview content={answer} />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
