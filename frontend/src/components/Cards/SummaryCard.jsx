import React from "react";
import { LuTrash2, LuCalendar, LuClock, LuFileText } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onselect,
  onDelete,
}) => {
  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 relative group"
      onClick={onselect}
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        {/* Icon & Role */}
        <div className="flex gap-2 sm:gap-4 flex-1 min-w-0">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold text-gray-800 shadow-inner flex-shrink-0"
            style={{ background: colors?.bgcolor || "#eff6ff" }}
          >
            {getInitials(role)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1 break-words" title={role}>{role}</h2>
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 break-words" title={topicsToFocus}>{topicsToFocus}</p>
          </div>
        </div>

        {/* Experience Tag */}
        <div className="px-2 sm:px-3 py-1 bg-gray-50 text-gray-600 rounded-md text-[10px] sm:text-xs font-medium border border-gray-100 whitespace-nowrap flex-shrink-0">
          {experience} {experience == 1 ? "Yr" : "Yrs"}
        </div>
      </div>


      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6 line-clamp-2 px-1">
        {description || "No description provided."}
      </p>

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <LuFileText className="text-blue-500 text-sm" />
            <span>{questions} Q&A</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <LuCalendar className="text-green-500 text-sm" />
            <span className="hidden sm:inline">{lastUpdated}</span>
            <span className="sm:hidden">{lastUpdated.split(',')[0]}</span>
          </div>
        </div>


        {/* Delete Button (visible on group hover) */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete Session"
        >
          <LuTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default SummaryCard;
