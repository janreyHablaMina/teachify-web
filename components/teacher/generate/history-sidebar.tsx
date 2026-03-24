"use client";

import { Clock, BookOpen, ArrowRight } from "lucide-react";

export type HistorySummaryItem = {
  id: number;
  topic: string;
  content: string;
  created_at: string;
};

interface HistorySidebarProps {
  summaries: HistorySummaryItem[];
  lastAddedId: number | null;
  isHistoryLoading: boolean;
  onSummaryClick: (summary: HistorySummaryItem) => void;
}

export function HistorySidebar({
  summaries,
  lastAddedId,
  isHistoryLoading,
  onSummaryClick,
}: HistorySidebarProps) {
  return (
    <aside className="rounded-[18px] border-2 border-slate-900 bg-[#f8fafc] p-6 shadow-[6px_6px_0_#cbd5e1]">
      <div className="mb-6 flex items-center justify-between border-b-2 border-slate-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-indigo-500 shadow-[3px_3px_0_#1e293b]">
            <Clock size={20} />
          </div>
          <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-wider flex-1">Recent History</h3>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{summaries.length} Total</span>
      </div>

      <div className="space-y-4">
        {isHistoryLoading && summaries.length === 0 ? (
          <div className="py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mx-auto" />
          </div>
        ) : summaries.length > 0 ? (
          summaries.slice(0, 6).map((s, index) => (
            <button
              key={s.id}
              onClick={() => onSummaryClick(s)}
              className={`group flex w-full items-center gap-4 rounded-2xl border-2 border-slate-900 bg-white p-4 text-left shadow-[5px_5px_0_#1e293b] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-slate-50 hover:shadow-[7px_7px_0_#4f46e5] ${
                index === 0 && s.id === lastAddedId
                  ? "animate-in fade-in zoom-in-95 slide-in-from-right-8 duration-700 ring-[3px] ring-indigo-500/20 bg-indigo-50/30 border-indigo-600 scale-[1.02]"
                  : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-[#f8fafc] text-indigo-600 shadow-[2px_2px_0_#0f172a] group-hover:bg-white">
                <BookOpen size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[14px] font-black text-slate-900">{s.topic}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {new Date(s.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <ArrowRight className="text-slate-200 transition-colors group-hover:text-indigo-400" size={16} />
            </button>
          ))
        ) : (
          <div className="py-10 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300">
              <BookOpen size={32} />
            </div>
            <p className="text-[13px] font-bold text-slate-400">No lessons generated yet.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
