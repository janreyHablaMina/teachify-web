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
  return (
    <section className="flex flex-col items-start justify-between gap-3 rounded-2xl border-2 border-slate-900 bg-[linear-gradient(120deg,#ffffff_0%,#ecfeff_60%,#fef9c3_100%)] px-[18px] py-4 shadow-[6px_6px_0_rgba(15,23,42,0.14)] min-[680px]:flex-row min-[680px]:items-center">
      <div className="grid gap-1.5">
        <p className="m-0 text-[11px] font-black uppercase tracking-[0.09em] text-slate-500">Plan Banner</p>
        <h3 className="mt-1 text-[24px] leading-none tracking-[-0.02em] text-slate-900">{planMeta.label} - {remaining} quizzes remaining</h3>
        <p className="m-0 text-[13px] font-bold text-slate-700">Generate your first quiz now</p>
        <div className="mt-1 grid gap-1">
          <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Trial Usage</p>
          <div
            className="h-[10px] w-full max-w-[260px] overflow-hidden rounded-full border-[1.5px] border-slate-900 bg-slate-200"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={limit}
            aria-valuenow={used}
          >
            <span className="block h-full bg-[linear-gradient(90deg,#22c55e_0%,#14b8a6_100%)]" style={{ width: `${progressPercent}%` }} />
          </div>
          <small className="text-[11px] font-extrabold text-slate-700">{remaining} of {limit} remaining</small>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 min-[680px]:w-auto min-[680px]:flex-row min-[680px]:items-center">
        <Link href="/teacher/generate" className={`${DASHBOARD_BTN_BASE} bg-teal-200 text-[13px] tracking-[0.05em] no-underline`}>
          Generate Quiz
        </Link>
        <button type="button" className={`${DASHBOARD_BTN_BASE} bg-yellow-200`}>
          Upgrade Plan
        </button>
      </div>
    </section>
  );
}
