"use client";

import { SystemMetric } from "./types";

const metrics: SystemMetric[] = [
  { label: "Server status", value: "Healthy", note: "99.98% uptime" },
  { label: "Queue workers", value: "12", note: "2 scaling workers idle" },
  { label: "Failed jobs", value: "34", note: "Past 24 hours" },
  { label: "API errors", value: "17", note: "4xx + 5xx this hour" },
  { label: "AI failures", value: "12", note: "Last 30 minutes" },
];

const accentColors = [
  "before:bg-emerald-500 hover:border-emerald-500",
  "before:bg-[#99f6e4] hover:border-[#99f6e4]",
  "before:bg-[#fef08a] hover:border-[#fef08a]",
  "before:bg-[#fda4af] hover:border-[#fda4af]",
  "before:bg-[#e9d5ff] hover:border-[#e9d5ff]",
];

export function SystemMetrics() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((item, i) => (
        <article
          key={item.label}
          className={`relative flex flex-col gap-1 overflow-hidden rounded-[20px] border border-slate-900/10 bg-white p-6 shadow-sm transition-all duration-400 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 hover:-translate-y-1 hover:shadow-lg ${accentColors[i]}`}
        >
          <p className="m-0 text-[11px] font-black uppercase tracking-wider text-slate-500">{item.label}</p>
          <strong className="mt-1 text-[28px] font-black tracking-tight text-[#0f172a]">{item.value}</strong>
          <span className="mt-1 text-[11px] font-bold text-slate-400">{item.note}</span>
        </article>
      ))}
    </section>
  );
}
