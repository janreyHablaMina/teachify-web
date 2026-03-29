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
    <aside className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_20px_35px_-18px_rgba(15,23,42,0.25)]">
      <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700">
          <Clock size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-[13px] font-black uppercase tracking-[0.1em] text-[#0f172a]">Recent Summaries</h3>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{summaries.length} saved items</p>
        </div>
      </div>

      <div className="space-y-3">
        {isHistoryLoading && summaries.length === 0 ? (
          <div className="py-10">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : summaries.length > 0 ? (
          summaries.slice(0, 6).map((s, index) => (
            <button
              key={s.id}
              onClick={() => onSummaryClick(s)}
              className={`group relative flex w-full items-center justify-between gap-3 rounded-[18px] border bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:translate-y-0 ${
                index === 0 && s.id === lastAddedId
                  ? "animate-in fade-in zoom-in-95 slide-in-from-right-8 duration-700 border-emerald-300 bg-emerald-50/40"
                  : "border-slate-200"
              }`}
            >
              {index === 0 && (
                <div className="absolute top-4 right-4 flex h-2 w-2">
                  <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></div>
                  <div className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></div>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-700">
                  <BookOpen size={18} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[14px] font-black text-[#0f172a] transition-colors group-hover:text-emerald-700">{s.topic}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    {new Date(s.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <ArrowRight className="shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-600" size={16} />
            </button>
          ))
        ) : (
          <div className="py-9 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-300">
              <BookOpen size={32} />
            </div>
            <p className="text-[13px] font-bold text-slate-500">No summaries yet.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
