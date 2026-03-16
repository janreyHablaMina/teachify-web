"use client";

import { SubscriptionRow } from "./types";

interface SubscriptionActionMenuProps {
  row: SubscriptionRow;
  isOpen: boolean;
  onToggle: () => void;
  onUpgrade: () => void;
  onExtend: () => void;
  onCancel: () => void;
  onRefund: () => void;
}

export function SubscriptionActionMenu({
  row,
  isOpen,
  onToggle,
  onUpgrade,
  onExtend,
  onCancel,
  onRefund,
}: SubscriptionActionMenuProps) {
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-[100] mt-2 min-w-[180px] flex flex-col gap-1 rounded-xl border border-slate-900/5 bg-white p-1.5 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-bold text-[#0f172a] transition-colors hover:bg-slate-50 disabled:opacity-40"
            onClick={onUpgrade}
            disabled={row.plan === "School"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            Upgrade Plan
          </button>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-bold text-[#0f172a] transition-colors hover:bg-slate-50"
            onClick={onExtend}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            Extend Term
          </button>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-bold text-[#0f172a] transition-colors hover:bg-slate-50"
            onClick={onCancel}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
            Cancel Plan
          </button>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-bold text-red-500 transition-colors hover:bg-red-50"
            onClick={onRefund}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            Process Refund
          </button>
        </div>
      )}
    </div>
  );
}
