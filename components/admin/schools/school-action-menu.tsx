"use client";

import { School } from "./types";

interface SchoolActionMenuProps {
  school: School;
  isOpen: boolean;
  onToggle: () => void;
  onUpgrade: () => void;
  onToggleStatus: () => void;
}

export function SchoolActionMenu({
  school,
  isOpen,
  onToggle,
  onUpgrade,
  onToggleStatus,
}: SchoolActionMenuProps) {
  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-[#99f6e4] hover:text-[#0f172a]"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-[100] mt-2 min-w-[170px] flex flex-col gap-1 rounded-xl border border-slate-900/5 bg-white p-1.5 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-bold text-[#0f172a] transition-colors hover:bg-slate-50">
            Manage Teachers
          </button>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-bold text-[#0f172a] transition-colors hover:bg-slate-50"
            onClick={onUpgrade}
          >
            Upgrade Plan
          </button>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-bold text-[#0f172a] transition-colors hover:bg-slate-50"
            onClick={onToggleStatus}
          >
            {school.status === "Active" ? "Disable" : "Enable"}
          </button>
          <button type="button" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-bold text-red-500 transition-colors hover:bg-red-50">
            Remove School
          </button>
        </div>
      )}
    </div>
  );
}
