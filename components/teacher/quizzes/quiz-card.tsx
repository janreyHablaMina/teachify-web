"use client";

import Link from "next/link";
import { Quiz } from "./types";

interface QuizCardProps {
  quiz: Quiz;
  onDeleteClick: (id: number) => void;
  isDeleting?: boolean;
}

export function QuizCard({ quiz, onDeleteClick, isDeleting }: QuizCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-[24px] border-2 border-[#0f172a] bg-white shadow-[6px_6px_0_#99f6e4] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_#0f172a]">
      <Link href={`/teacher/quizzes/${quiz.id}`} className="block h-full p-7">
        <div className="flex h-full flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="m-0 text-[18px] font-black leading-tight tracking-tight text-[#0f172a] group-hover:text-teal-700">
              {quiz.title}
            </h3>
            <button
              type="button"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                onDeleteClick(quiz.id);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50 hover:border-red-500 disabled:opacity-50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#0f172a]/10 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
              {quiz.topic}
            </span>
            <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold text-teal-700">
              {quiz.type === "file" ? "PDF Source" : "Manual"}
            </span>
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p className="m-0 text-[9px] font-black uppercase tracking-widest text-slate-400">Questions</p>
              <strong className="text-[18px] font-black text-[#0f172a]">{quiz.questions_count ?? 0}</strong>
            </div>
            <div className="text-right">
              <p className="m-0 text-[9px] font-black uppercase tracking-widest text-slate-400">Created</p>
              <span className="text-[13px] font-bold text-[#0f172a]">
                {new Date(quiz.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
