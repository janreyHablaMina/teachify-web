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
    <article className="group relative flex h-full flex-col rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-[0_18px_34px_-20px_rgba(15,23,42,0.25)] transition-all hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_24px_40px_-18px_rgba(8,145,178,0.3)]">
      <div className="pointer-events-none absolute -left-12 -top-12 h-24 w-24 rounded-full bg-cyan-200/50 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
          <BookOpen size={24} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDownload(summary)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
            title="Download PDF"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => onDelete(summary)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#fed7aa] bg-white text-[#9a3412] transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h4 className="line-clamp-2 min-h-[3rem] text-[20px] font-black leading-tight tracking-tight text-slate-900 group-hover:text-cyan-800">
        {summary.topic}
      </h4>

      <div className="mt-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.06em] text-slate-500">
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
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-700 bg-cyan-700 py-3 text-[12px] font-black uppercase tracking-[0.08em] text-white transition hover:bg-cyan-800"
        >
          Review Lesson
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}
