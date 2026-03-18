"use client";

import { PlanMix } from "./types";

const planDistribution: PlanMix[] = [
  { plan: "Free users", users: 12, percent: 18 },
  { plan: "Basic users", users: 35, percent: 52 },
  { plan: "Pro users", users: 20, percent: 30 },
];

export function PlanMixDistribution() {
  return (
    <article className="relative flex flex-col gap-6 overflow-hidden rounded-[24px] border border-slate-900/10 bg-white p-7 shadow-sm before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#e9d5ff]">
      <div className="flex items-center justify-between">
        <h4 className="m-0 text-[20px] font-black tracking-tight text-[#0f172a]">Plan Mix Distribution</h4>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-500">Segment breakdown</span>
      </div>

      <ul className="m-0 flex list-none flex-col gap-5 p-0">
        {planDistribution.map((item) => (
          <li key={item.plan} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <strong className="text-[15px] font-extrabold text-[#0f172a]">{item.plan}: {item.users} users</strong>
              <span className="text-[14px] font-black text-[#0f172a]">{item.percent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
