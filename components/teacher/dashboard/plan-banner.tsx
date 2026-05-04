import Link from "next/link";
import { DASHBOARD_BTN_BASE } from "./plan";
import type { PlanMeta } from "./types";

type PlanBannerProps = {
  planMeta: PlanMeta;
  remaining: number;
  limit: number;
  used: number;
  progressPercent: number;
};

export function PlanBanner({ planMeta, remaining, limit, used, progressPercent }: PlanBannerProps) {
  const status = remaining <= 1 ? "critical" : remaining === 2 ? "warning" : "ready";
  const statusConfig = {
    ready: { 
      message: "You're ready to create quizzes", 
      icon: "🟢", 
      border: "border-emerald-500", 
      bg: "bg-emerald-100" 
    },
    warning: { 
      message: "You're halfway through your free usage", 
      icon: "🟡", 
      border: "border-yellow-500", 
      bg: "bg-yellow-100" 
    },
    critical: { 
      message: "You're about to run out", 
      icon: "🔴", 
      border: "border-red-500", 
      bg: "bg-red-100" 
    },
  }[status];

  return (
    <section className={`flex flex-col items-start justify-between gap-3 rounded-[24px] border-[1.5px] ${statusConfig.border} ${statusConfig.bg} px-[18px] py-4 shadow-[2px_2px_0_rgba(15,23,42,0.1)] min-[680px]:flex-row min-[680px]:items-center`}>
      <div className="grid gap-1.5">
        <div className="flex items-center gap-2">
          <p className="m-0 text-[11px] font-black uppercase tracking-[0.09em] text-slate-500">Usage Status</p>
          <span className="text-[12px]">{statusConfig.icon}</span>
          <span className="text-[11px] font-black uppercase tracking-[0.05em] text-slate-900">{statusConfig.message}</span>
        </div>
        <h3 className="mt-1 text-[24px] leading-none tracking-[-0.02em] text-slate-900">{planMeta.label} - {remaining} generations remaining</h3>
        <p className="m-0 text-[13px] font-bold text-slate-700">Generate your first quiz now</p>
        <div className="mt-1 grid gap-1">
          <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Plan Usage</p>
          <div
            className="h-[10px] w-full max-w-[260px] overflow-hidden rounded-full border-[1.5px] border-slate-900 bg-slate-200"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={limit}
            aria-valuenow={used}
          >
            <span className="block h-full bg-[linear-gradient(90deg,#22c55e_0%,#14b8a6_100%)]" style={{ width: `${progressPercent}%` }} />
          </div>
          <small className="text-[11px] font-extrabold text-slate-700">{remaining} of {limit} generations remaining</small>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 min-[680px]:w-auto min-[680px]:flex-row min-[680px]:items-center">
        <Link href="/teacher/generate" className={`${DASHBOARD_BTN_BASE} bg-teal-200 text-[13px] tracking-[0.05em] no-underline`}>
          Generate Quiz
        </Link>
        <Link href="/teacher/upgrade" className={`${DASHBOARD_BTN_BASE} bg-yellow-200 no-underline`}>
          Upgrade Plan
        </Link>
      </div>
    </section>
  );
}
