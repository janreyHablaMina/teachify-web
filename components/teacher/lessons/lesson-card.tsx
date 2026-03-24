"use client";

import { BookOpen, Download, Trash2, Calendar, ArrowRight } from "lucide-react";

export type LessonSummary = {
  id: number;
  topic: string;
  content: string;
  created_at: string;
};

interface LessonCardProps {
  summary: LessonSummary;
  onView: (summary: LessonSummary) => void;
  onDownload: (summary: LessonSummary) => void;
  onDelete: (summary: LessonSummary) => void;
}

export function LessonCard({ summary, onView, onDownload, onDelete }: LessonCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-[24px] border-2 border-[#0f172a] bg-white p-7 shadow-[8px_8px_0_#c7d2fe] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_#6366f1]">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#0f172a] bg-indigo-50 text-indigo-500">
          <BookOpen size={24} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDownload(summary)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-[1.5px] border-[#0f172a] bg-white text-[#0f172a] transition hover:bg-slate-50"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => onDelete(summary)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-[1.5px] border-[#0f172a] bg-white text-[#0f172a] transition hover:bg-rose-50 hover:text-rose-500"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <h4 className="line-clamp-2 min-h-[3rem] text-[20px] font-black leading-tight tracking-tight text-[#0f172a] group-hover:text-indigo-700">
        {summary.topic}
      </h4>

      <div className="mt-5 flex items-center gap-2 text-[12px] font-bold text-slate-500">
        <Calendar size={14} />
        {new Date(summary.created_at).toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </div>

      <div className="mt-6">
        <button
          onClick={() => onView(summary)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#0f172a] bg-[#edf2ff] py-3 text-[13px] font-black uppercase tracking-wide text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100"
        >
          Review Lesson
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}
