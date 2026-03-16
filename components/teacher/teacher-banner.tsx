"use client";

import Link from "next/link";

interface TeacherBannerProps {
  planLabel: string;
  remaining: number;
  limit: number;
  progressPercent: number;
}

export function TeacherBanner({ planLabel, remaining, limit, progressPercent }: TeacherBannerProps) {
  return (
    <section className="relative mb-8 grid grid-cols-1 gap-6 overflow-hidden rounded-[24px] border-2 border-[#0f172a] bg-white p-8 shadow-[10px_10px_0_#99f6e4] transition-all hover:shadow-[14px_14px_0_#0f172a] md:grid-cols-[1fr_auto]">
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-2 inline-block rounded-full border border-[#0f172a] bg-[#fef08a] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0f172a]">
            Plan Status
          </p>
          <h3 className="m-0 text-[26px] font-black tracking-tight text-[#0f172a]">
            {planLabel} - {remaining} quizzes remaining
          </h3>
          <p className="mt-1 text-[15px] font-bold text-slate-500">
            Generate your first quiz now and start teaching.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[12px] font-black uppercase tracking-wider text-slate-500">
            <span>Usage Progress</span>
            <span>{remaining} of {limit} remaining</span>
          </div>
          <div className="h-4 w-full rounded-full border-2 border-[#0f172a] bg-slate-100 p-[2px]">
            <div 
              className="h-full rounded-full bg-[#99f6e4] transition-all duration-1000" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3 sm:flex-row md:flex-col">
        <Link 
          href="/teacher/generate" 
          className="flex items-center justify-center rounded-xl border-2 border-[#0f172a] bg-[#0f172a] px-8 py-4 text-[14px] font-black uppercase tracking-wider text-white transition hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
        >
          Generate Quiz
        </Link>
        <button 
          className="flex items-center justify-center rounded-xl border-2 border-[#0f172a] bg-white px-8 py-4 text-[14px] font-black uppercase tracking-wider text-[#0f172a] transition hover:-translate-y-1 hover:bg-[#99f6e4] active:translate-y-0"
        >
          Upgrade Plan
        </button>
      </div>
    </section>
  );
}
