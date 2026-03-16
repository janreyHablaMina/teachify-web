"use client";

interface UsageStatsProps {
  remaining: number;
  limit: number;
  progress: number;
  planLabel: string;
}

export function UsageStats({ remaining, limit, progress, planLabel }: UsageStatsProps) {
  return (
    <section className="mb-8 rounded-[18px] border border-slate-900/10 bg-white p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="m-0 text-[11px] font-black uppercase tracking-widest text-slate-500">{planLabel} Usage</p>
          <p className="mt-1 text-[18px] font-black text-[#0f172a]">{remaining} generations remaining</p>
        </div>
        <div className="text-right">
          <p className="m-0 text-[11px] font-black uppercase tracking-widest text-slate-500">Monthly Limit</p>
          <p className="mt-1 text-[18px] font-black text-[#0f172a]">{limit} quizzes</p>
        </div>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full border-2 border-slate-900 bg-slate-100 p-[2px]">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e_0%,#14b8a6_100%)] transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
