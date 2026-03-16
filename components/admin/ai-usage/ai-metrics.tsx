"use client";

import { AIMetric } from "./types";

const metrics: AIMetric[] = [
  { label: "Total tokens used", value: "128,400,000", note: "All-time usage" },
  { label: "Tokens used today", value: "1,240,000", note: "Last 24 hours" },
  { label: "Used this month", value: "23,000,000", note: "March usage" },
  { label: "Estimated cost", value: "$17.40", note: "Current month" },
];

const accentColors = [
  "before:bg-[#99f6e4] hover:border-[#99f6e4]",
  "before:bg-[#fef08a] hover:border-[#fef08a]",
  "before:bg-[#fda4af] hover:border-[#fda4af]",
  "before:bg-[#e9d5ff] hover:border-[#e9d5ff]",
];

export function AIMetrics() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => (
        <article
          key={metric.label}
          className={`relative flex flex-col gap-1 overflow-hidden rounded-[20px] border border-slate-900/10 bg-white p-6 shadow-sm transition-all duration-400 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 hover:-translate-y-1 hover:shadow-lg ${accentColors[i]}`}
        >
          <p className="m-0 text-[11px] font-black uppercase tracking-wider text-slate-500">{metric.label}</p>
          <strong className="mt-1 text-[28px] font-black tracking-tight text-[#0f172a]">{metric.value}</strong>
          <span className="mt-1 text-[11px] font-bold text-slate-400">{metric.note}</span>
        </article>
      ))}
    </section>
  );
}
