"use client";

import { BookOpen, Download, Trash2, Calendar, ArrowRight } from "lucide-react";

interface LessonCardProps {
  summary: {
    id: number;
    topic: string;
    content: string;
    created_at: string;
  };
  onView: (summary: any) => void;
  onDownload: (summary: any) => void;
}

export function LessonCard({ summary, onView, onDownload }: LessonCardProps) {
  return (
    <article className="group relative flex flex-col rounded-[22px] border-2 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a] transition hover:-translate-y-1 hover:translate-x-[-1px] hover:shadow-[7px_7px_0_#4f46e5]">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-indigo-50 text-indigo-500 shadow-[2px_2px_0_#0f172a]">
          <BookOpen size={24} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDownload(summary)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-white transition hover:bg-slate-50"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-white transition hover:bg-rose-50 hover:text-rose-500"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <h4 className="line-clamp-2 min-h-[3rem] text-[18px] font-black leading-tight text-[#0f172a]">
        {summary.topic}
      </h4>

      <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-slate-500">
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
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-[#edf2ff] py-3 text-[13px] font-black uppercase tracking-wide text-indigo-700 transition hover:bg-indigo-100"
        >
          Review Lesson
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}
