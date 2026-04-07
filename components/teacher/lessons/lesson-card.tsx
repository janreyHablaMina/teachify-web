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
    <article className="group relative flex h-full flex-col rounded-[26px] border border-[#f5c2ad] bg-[linear-gradient(180deg,#fffdf8_0%,#fff7ed_100%)] p-6 shadow-[0_18px_34px_-20px_rgba(194,65,12,0.5)] transition-all hover:-translate-y-1 hover:border-[#fb923c] hover:shadow-[0_24px_40px_-18px_rgba(194,65,12,0.45)]">
      <div className="pointer-events-none absolute -left-12 -top-12 h-24 w-24 rounded-full bg-amber-200/50 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#fdba74] bg-[#fff7ed] text-[#c2410c]">
          <BookOpen size={24} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDownload(summary)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#fed7aa] bg-white text-[#9a3412] transition hover:border-[#fdba74] hover:bg-[#fff7ed]"
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

      <h4 className="line-clamp-2 min-h-[3rem] text-[20px] font-black leading-tight tracking-tight text-[#7c2d12] group-hover:text-[#9a3412]">
        {summary.topic}
      </h4>

      <div className="mt-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.06em] text-[#b45309]">
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
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#7c2d12] bg-[#7c2d12] py-3 text-[12px] font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#9a3412]"
        >
          Review Lesson
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}
