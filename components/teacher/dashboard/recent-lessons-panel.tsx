import { BookText, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import type { LessonSummary } from "./types";

type RecentLessonsPanelProps = {
  lessons: LessonSummary[];
};

export function RecentLessonsPanel({ lessons }: RecentLessonsPanelProps) {
  const displayLessons = lessons.slice(0, 3);

  return (
    <section className="flex h-full flex-col gap-5 rounded-[24px] border-[1.5px] border-cyan-900 bg-cyan-50/40 p-6 shadow-[2px_2px_0_#083344]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BookText className="h-5 w-5 text-cyan-500" />
          <h3 className="text-[18px] font-black uppercase tracking-tight text-slate-800">Recent Lessons</h3>
        </div>
        <Link 
          href="/teacher/lessons" 
          className="text-[11px] font-black uppercase tracking-wider text-cyan-600 no-underline hover:text-cyan-700 hover:underline"
        >
          See All
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {displayLessons.length > 0 ? (
          displayLessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className="group flex items-center justify-between rounded-[20px] border-2 border-slate-900 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[4px_4px_0_#0f172a]"
            >
              <div className="flex flex-col gap-1">
                <p className="m-0 text-[14px] font-black leading-tight text-slate-900 group-hover:text-cyan-700">
                  {lesson.topic}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <Calendar className="h-3 w-3" />
                  {new Date(lesson.created_at).toLocaleDateString(undefined, { 
                    month: "short", 
                    day: "numeric", 
                    year: "numeric" 
                  })}
                </div>
              </div>
              <Link 
                href={`/teacher/lessons?id=${lesson.id}`} 
                className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-slate-900 bg-cyan-200 text-slate-900 shadow-[2px_2px_0_#0f172a] transition hover:bg-cyan-300 active:translate-x-0.5 active:translate-y-0.5"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
            <p className="text-[13px] font-bold">No lessons yet.</p>
            <Link 
              href="/teacher/generate" 
              className="mt-2 text-[12px] font-black uppercase tracking-wider text-cyan-600 hover:underline"
            >
              Create your first lesson
            </Link>
          </div>
        )}
      </div>

      <div className="mt-auto pt-2">
        <p className="m-0 text-[11px] font-bold text-slate-400 italic">
          Tip: You can generate quizzes directly from your lessons.
        </p>
      </div>
    </section>
  );
}
