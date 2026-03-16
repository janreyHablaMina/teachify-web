"use client";

import { TopUser } from "./types";

const topUsers: TopUser[] = [
  { name: "Carlos M.", school: "Lakeshore Prep", quizzes: 162, tokens: "4,200,000", estCost: "$3.10" },
  { name: "Maple Grove High", school: "Maple Grove High", quizzes: 148, tokens: "3,600,000", estCost: "$2.66" },
  { name: "Nora Patel", school: "Hillside School", quizzes: 103, tokens: "2,700,000", estCost: "$1.99" },
  { name: "Northside Academy", school: "Northside Academy", quizzes: 87, tokens: "2,100,000", estCost: "$1.55" },
  { name: "Isabelle Cruz", school: "Eastbay Learning", quizzes: 74, tokens: "1,800,000", estCost: "$1.33" },
];

const rowAccents = ["bg-[#99f6e4]", "bg-[#fef08a]", "bg-[#fda4af]", "bg-[#e9d5ff]", "bg-red-400"];

export function AIUsageTable() {
  return (
    <article className="relative flex flex-col gap-6 overflow-hidden rounded-[24px] border border-slate-900/10 bg-white p-7 shadow-sm before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#99f6e4]">
      <div className="flex items-center justify-between">
        <h4 className="m-0 text-[24px] font-black tracking-tight text-[#0f172a]">Top Generated Loads</h4>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-500">Highest token consumption</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] items-center px-6 py-3 bg-[#0f172a] rounded-xl text-white text-[10px] font-black uppercase tracking-[0.1em]">
          <div>Name</div>
          <div>School</div>
          <div>Quizzes</div>
          <div>Tokens</div>
          <div>Est. Cost</div>
        </div>

        {/* Rows */}
        {topUsers.map((user, idx) => (
          <div
            key={user.name}
            className="group relative grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] items-center px-6 py-5 bg-white border border-slate-900/5 rounded-2xl transition-all hover:scale-[1.005] hover:-translate-y-0.5 hover:shadow-lg hover:border-[#99f6e4] hover:z-10"
          >
            {/* Accent Bar */}
            <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full ${rowAccents[idx % rowAccents.length]}`} />

            <div className="text-[15px] font-extrabold text-[#0f172a]">{user.name}</div>
            <div className="text-[13px] font-semibold text-slate-500">{user.school}</div>
            <div className="text-[13px] font-semibold text-slate-500">{user.quizzes}</div>
            <div>
              <div className="w-fit rounded-md bg-slate-100 px-2 py-1 font-mono text-[13px] font-bold text-[#0f172a]">
                {user.tokens}
              </div>
            </div>
            <div>
              <div className="w-fit rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[12px] font-black text-emerald-700">
                {user.estCost}
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
