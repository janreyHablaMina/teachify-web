"use client";

const metrics = [
  { label: "Total tokens used", value: "128,400,000", note: "All-time usage" },
  { label: "Tokens used today", value: "1,240,000", note: "Last 24 hours" },
  { label: "Used this month", value: "23,000,000", note: "March usage" },
  { label: "Estimated cost", value: "$17.40", note: "Current month" },
] as const;

const topUsers = [
  { name: "Carlos M.", school: "Lakeshore Prep", quizzes: 162, tokens: "4,200,000", estCost: "$3.10" },
  { name: "Maple Grove High", school: "Maple Grove High", quizzes: 148, tokens: "3,600,000", estCost: "$2.66" },
  { name: "Nora Patel", school: "Hillside School", quizzes: 103, tokens: "2,700,000", estCost: "$1.99" },
  { name: "Northside Academy", school: "Northside Academy", quizzes: 87, tokens: "2,100,000", estCost: "$1.55" },
  { name: "Isabelle Cruz", school: "Eastbay Learning", quizzes: 74, tokens: "1,800,000", estCost: "$1.33" },
] as const;

export default function AdminAiUsagePage() {
  return (
    <section className="flex min-h-full flex-col gap-8 py-2">
      <header>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Admin / AI Usage
          </p>
          <h2 className="mt-1 text-4xl font-extrabold text-slate-900">
            Monitor Consumption
          </h2>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, idx) => (
          <article
            key={metric.label}
            className={
              idx === 0
                ? "rounded-2xl border border-slate-200 border-t-4 border-t-teal-200 bg-white px-5 pb-5 pt-6 shadow-sm"
                : idx === 1
                  ? "rounded-2xl border border-slate-200 border-t-4 border-t-amber-200 bg-white px-5 pb-5 pt-6 shadow-sm"
                  : idx === 2
                    ? "rounded-2xl border border-slate-200 border-t-4 border-t-rose-300 bg-white px-5 pb-5 pt-6 shadow-sm"
                    : "rounded-2xl border border-slate-200 border-t-4 border-t-violet-200 bg-white px-5 pb-5 pt-6 shadow-sm"
            }
          >
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              {metric.label}
            </p>
            <strong className="mt-1 block text-3xl font-black leading-none text-slate-900">
              {metric.value}
            </strong>
            <span className="mt-1 block text-sm font-semibold text-slate-500">{metric.note}</span>
          </article>
        ))}
      </section>

      <article className="rounded-3xl border border-slate-200 border-t-4 border-t-teal-300 bg-white p-7 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-3xl font-black text-slate-900">Top Generated Loads</h4>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-500">
            Highest token consumption
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="bg-slate-900 text-xs font-black uppercase tracking-wider text-white">
                <th className="rounded-l-xl px-4 py-3">Name</th>
                <th className="px-4 py-3">School</th>
                <th className="px-4 py-3">Quizzes</th>
                <th className="px-4 py-3">Tokens</th>
                <th className="rounded-r-xl px-4 py-3">Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, idx) => {
                const rowAccentClass =
                  idx === 0
                    ? "border-l-teal-300"
                    : idx === 1
                      ? "border-l-amber-300"
                      : idx === 2
                        ? "border-l-rose-300"
                        : idx === 3
                          ? "border-l-violet-300"
                          : "border-l-red-400";

                return (
                  <tr key={user.name} className={`border-l-4 ${rowAccentClass} bg-white shadow-sm`}>
                    <td className="rounded-l-xl border-y border-l border-slate-200 px-4 py-3 text-xl font-extrabold text-slate-900">
                      {user.name}
                    </td>
                    <td className="border-y border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
                      {user.school}
                    </td>
                    <td className="border-y border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
                      {user.quizzes}
                    </td>
                    <td className="border-y border-slate-200 px-4 py-3">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-sm font-bold text-slate-900">
                        {user.tokens}
                      </span>
                    </td>
                    <td className="rounded-r-xl border-y border-r border-slate-200 px-4 py-3">
                      <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                        {user.estCost}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
