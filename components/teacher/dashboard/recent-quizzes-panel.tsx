import Link from "next/link";
import type { QuizSummary } from "./types";
import { DASHBOARD_BTN_BASE } from "./plan";

type RecentQuizzesPanelProps = {
  quizzes: QuizSummary[];
};

export function RecentQuizzesPanel({ quizzes }: RecentQuizzesPanelProps) {
  return (
    <article className="flex flex-col gap-[14px] rounded-[18px] border border-slate-900/10 bg-white p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <h4 className="m-0 text-[20px] font-black tracking-[-0.02em] text-slate-900">My Recent Quizzes</h4>
      </div>
      {quizzes.length === 0 ? (
        <div className="grid gap-2 rounded-xl border-[1.5px] border-dashed border-slate-900/35 bg-slate-50 p-4">
          <p className="m-0 text-[14px] font-extrabold text-slate-900">You haven&apos;t created any quizzes yet.</p>
          <span className="text-[12px] font-bold text-slate-600">Start by generating your first quiz.</span>
          <Link href="/teacher/generate" className={`${DASHBOARD_BTN_BASE} w-full bg-teal-200 text-[13px] tracking-[0.05em] no-underline`}>
            Generate Quiz
          </Link>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="flex flex-col items-start justify-between gap-2 min-[680px]:flex-row min-[680px]:items-center">
              <p className="m-0 flex-1 rounded-xl border border-slate-900/10 bg-slate-50 px-[13px] py-3 text-[14px] font-bold text-slate-900">{quiz.title}</p>
              <div className="flex gap-2">
                <Link href={`/teacher/quizzes/${quiz.id}`} className="inline-flex items-center justify-center rounded-lg border-[1.5px] border-slate-900 bg-white px-[9px] py-[7px] text-[11px] font-black uppercase tracking-[0.04em] text-slate-900 no-underline">
                  View
                </Link>
                <span className="self-center text-[11px] font-extrabold text-slate-500">{new Date(quiz.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
