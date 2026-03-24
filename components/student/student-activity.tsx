"use client";

import { Clock, Flame, CheckCircle2 } from "lucide-react";

export function StudentActivity() {
  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[32px] border border-[#0f172a]/20 bg-white p-8">
        <h3 className="mb-6 flex items-center gap-2 text-[18px] font-black">
          <Clock className="h-5 w-5 text-indigo-500" />
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
              className="group relative flex flex-col gap-1 border-l-2 border-dashed border-slate-200 pl-6 pb-2 transition-all hover:border-slate-300"
            >
              <div
                className="absolute -left-1.5 top-0 h-3 w-3 rounded-full border-2 border-white bg-white"
                style={{ borderColor: item.color }}
              />
              <h5 className="text-[14px] font-black tracking-tight text-[#0f172a]">{item.title}</h5>
              <p className="text-[12px] font-bold text-slate-500">{item.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-[#0f172a]/20 bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-7">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[16px] font-black text-[#0f172a]">
            <Flame className="h-4 w-4 text-indigo-500" />
            Learning Streak
          </h3>
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-black text-indigo-700">
            5 days
          </span>
        </div>

        <div className="mb-4 grid grid-cols-7 gap-2">
          {[
            { day: "M", done: true },
            { day: "T", done: true },
            { day: "W", done: true },
            { day: "T", done: true },
            { day: "F", done: true },
            { day: "S", done: false },
            { day: "S", done: false },
          ].map((item, i) => (
            <div
              key={`${item.day}-${i}`}
              className={`rounded-xl border px-2 py-2 text-center ${
                item.done ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-[10px] font-black uppercase text-slate-400">{item.day}</p>
              <div className="mt-1 flex justify-center">
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-slate-300 bg-slate-100" />
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[12px] font-bold text-slate-500">
          You&apos;re on a strong run. Keep at least one study session each day to protect your streak.
        </p>
      </section>
    </div>
  );
}
