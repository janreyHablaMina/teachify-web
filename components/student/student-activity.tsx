"use client";

import { Clock, Calendar } from "lucide-react";

export function StudentActivity() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border-2 border-[#0f172a] bg-slate-900 p-8 shadow-[8px_8px_0_#818cf8] text-white">
        <h3 className="mb-6 flex items-center gap-2 text-[18px] font-black">
          <Clock className="h-5 w-5" />
          Due Soon
        </h3>
        <div className="space-y-5">
          {[
            { title: "Quantum Physics Quiz", date: "Today, 11:59 PM", color: "#fecaca" },
            { title: "Final Exam Review", date: "Tomorrow", color: "#818cf8" },
            { title: "Mid-term Assessment", date: "Mar 24", color: "#fef08a" },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative flex flex-col gap-1 border-l-2 border-dashed border-white/20 pl-6 pb-2 transition-all hover:border-white"
            >
              <div
                className="absolute -left-1.5 top-0 h-3 w-3 rounded-full border-2 border-white bg-slate-900"
                style={{ borderColor: item.color }}
              />
              <h5 className="text-[14px] font-black tracking-tight">{item.title}</h5>
              <p className="text-[12px] font-bold text-slate-400 opacity-60">{item.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border-2 border-[#0f172a] bg-white p-7">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-black text-[#0f172a]">Learning Streak</h3>
          <Calendar className="h-4 w-4 text-slate-400" />
        </div>
        <div className="flex items-end justify-between gap-1">
          {[4, 7, 2, 8, 5, 10, 3].map((h, i) => (
            <div key={i} className="flex-1 rounded-full bg-slate-100 relative group" style={{ height: "60px" }}>
              <div
                className="absolute bottom-0 w-full rounded-full bg-indigo-500 transition-all hover:bg-indigo-400"
                style={{ height: `${h * 10}%` }}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] font-bold text-slate-500">
          You&apos;ve studied for <span className="font-black text-[#0f172a]">5 days in a row</span>. Keep it up!
        </p>
      </section>
    </div>
  );
}
