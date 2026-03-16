"use client";

import Link from "next/link";
import { QuizSummary } from "./types";

interface TeacherRecentQuizzesProps {
  quizzes: QuizSummary[];
}

export function TeacherRecentQuizzes({ quizzes }: TeacherRecentQuizzesProps) {
  return (
    <article className="flex flex-col gap-6 rounded-[24px] border border-slate-900/10 bg-white p-7 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h4 className="m-0 text-[20px] font-black tracking-tight text-[#0f172a]">My Recent Quizzes</h4>
        <Link 
          href="/teacher/quizzes" 
          className="text-[13px] font-bold text-teal-600 hover:underline"
        >
          View All
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <p className="m-0 text-[15px] font-bold text-slate-500">You haven&apos;t created any quizzes yet.</p>
          <Link 
            href="/teacher/generate" 
            className="rounded-xl border-2 border-[#0f172a] bg-[#0f172a] px-6 py-2 text-[13px] font-black uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Create Your First Quiz
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {quizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              className="group flex items-center justify-between rounded-2xl border border-slate-900/5 bg-[#f8fbff] px-5 py-4 transition-all hover:bg-white hover:border-[#99f6e4] hover:translate-x-1"
            >
              <p className="m-0 text-[14px] font-[950] text-[#0f172a] group-hover:text-teal-700">{quiz.title}</p>
              <div className="flex items-center gap-4">
                <span className="hidden text-[12px] font-bold text-slate-400 sm:block">
                  {new Date(quiz.created_at).toLocaleDateString()}
                </span>
                <Link 
                  href={`/teacher/quizzes/${quiz.id}`} 
                  className="rounded-lg bg-white border border-slate-200 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#0f172a] shadow-sm transition hover:bg-[#fef08a] hover:border-[#0f172a]"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
