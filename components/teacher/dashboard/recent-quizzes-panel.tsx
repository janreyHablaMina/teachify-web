import Link from "next/link";
import type { QuizSummary } from "./types";
import { DASHBOARD_BTN_BASE } from "./plan";
import { CalendarDays } from "lucide-react";

type RecentQuizzesPanelProps = {
  quizzes: QuizSummary[];
};

export function RecentQuizzesPanel({ quizzes }: RecentQuizzesPanelProps) {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="m-0 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Activity</p>
          <h4 className="m-0 mt-1 text-[20px] font-black tracking-[-0.02em] text-slate-900">My Recent Quizzes</h4>
        </div>
      </div>
      {quizzes.length === 0 ? (
        <div className="grid gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="m-0 text-[14px] font-extrabold text-slate-900">You haven&apos;t created any quizzes yet.</p>
          <span className="text-[12px] font-bold text-slate-600">Start by generating your first quiz.</span>
          <Link
            href="/teacher/generate"
            className={`${DASHBOARD_BTN_BASE.replace("shadow-[4px_4px_0_#0f172a]", "shadow-sm")} w-full bg-teal-200 text-[13px] tracking-[0.05em] no-underline`}
          >
            Generate Quiz
          </Link>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {quizzes.map((quiz, index) => (
            <div key={quiz.id} className="flex flex-col items-start justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3 min-[680px]:flex-row min-[680px]:items-center">
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[14px] font-black text-slate-900">{quiz.title}</p>
                <p className="m-0 mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(quiz.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600">
                  #{index + 1}
                </span>
                <Link href={`/teacher/quizzes/${quiz.id}`} className="inline-flex items-center justify-center rounded-lg border border-slate-400 bg-white px-2.5 py-[7px] text-[10px] font-black uppercase tracking-[0.05em] text-slate-900 no-underline transition hover:border-slate-600">
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
