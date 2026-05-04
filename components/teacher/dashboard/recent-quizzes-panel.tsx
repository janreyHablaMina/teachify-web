import Link from "next/link";
import type { QuizSummary } from "./types";
import { DASHBOARD_BTN_BASE } from "./plan";
import { CalendarDays, Sparkles, FileQuestion, ArrowRight } from "lucide-react";

type RecentQuizzesPanelProps = {
  quizzes: QuizSummary[];
};

export function RecentQuizzesPanel({ quizzes }: RecentQuizzesPanelProps) {
  return (
    <article className="flex h-full flex-col gap-5 rounded-[24px] border-[1.5px] border-emerald-900 bg-emerald-50/40 p-6 shadow-[2px_2px_0_#064e3b]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileQuestion className="h-5 w-5 text-emerald-500" />
          <h4 className="m-0 text-[18px] font-black uppercase tracking-tight text-slate-900">Recent Quizzes</h4>
        </div>
        {quizzes.length > 0 && (
          <Link 
            href="/teacher/quizzes" 
            className="text-[11px] font-black uppercase tracking-wider text-emerald-600 no-underline hover:text-emerald-700 hover:underline"
          >
            See All
          </Link>
        )}
      </div>

      {quizzes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-400">
            <Sparkles className="h-8 w-8" />
          </div>
          <h5 className="m-0 text-[18px] font-black text-slate-900">No quizzes yet</h5>
          <p className="mt-2 text-[14px] font-bold text-slate-500">
            Start creating your first AI-powered quiz. It only takes a topic or a document to get started.
          </p>
          <Link
            href="/teacher/generate"
            className={`${DASHBOARD_BTN_BASE} mt-6 gap-2 bg-emerald-100 px-8 py-3.5 no-underline transition hover:bg-emerald-200`}
          >
            Generate Quiz
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {quizzes.map((quiz, index) => (
            <div 
              key={quiz.id} 
              className="group flex items-center justify-between rounded-[20px] border-2 border-slate-900 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[4px_4px_0_#0f172a]"
            >
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[14px] font-black text-slate-900 group-hover:text-emerald-700">
                  {quiz.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(quiz.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </div>
              </div>
              <Link 
                href={`/teacher/quizzes/${quiz.id}`} 
                className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-slate-900 bg-emerald-200 text-slate-900 shadow-[2px_2px_0_#0f172a] transition hover:bg-emerald-300 active:translate-x-0.5 active:translate-y-0.5"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {quizzes.length > 0 && (
        <div className="mt-auto pt-2">
          <p className="m-0 text-[11px] font-bold text-slate-400 italic">
            Next step: Assign these quizzes to your classes.
          </p>
        </div>
      )}
    </article>
  );
}
