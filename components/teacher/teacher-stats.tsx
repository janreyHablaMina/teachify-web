"use client";

import { TeacherMetric } from "./types";

interface TeacherStatsProps {
  metrics: TeacherMetric[];
}

export function TeacherStats({ metrics }: TeacherStatsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, idx) => (
        <article 
          key={idx} 
          className="group flex flex-col gap-2 rounded-[24px] border border-slate-900/10 bg-white p-7 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:border-[#99f6e4] hover:shadow-lg"
        >
          <p className="m-0 text-[12px] font-black uppercase tracking-widest text-slate-500">
            {metric.title}
          </p>
          <strong className="text-[36px] font-black leading-none tracking-tight text-[#0f172a] transition-transform group-hover:scale-110 group-hover:text-teal-600">
            {metric.value}
          </strong>
        </article>
      ))}
    </div>
  );
}
