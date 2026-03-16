"use client";

const metrics = [
  { label: "Total quizzes generated", value: "248,931", accent: "before:bg-[#99f6e4] hover:border-[#99f6e4]" },
  { label: "Quizzes generated today", value: "412", accent: "before:bg-[#fef08a] hover:border-[#fef08a]" },
  { label: "Average questions per quiz", value: "12.4", accent: "before:bg-[#fda4af] hover:border-[#fda4af]" },
];

export function QuizzesMetrics() {
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((item) => (
        <article
          key={item.label}
          className={`relative flex flex-col gap-2 overflow-hidden rounded-[20px] border border-slate-900/10 bg-white p-6 shadow-sm transition-all duration-400 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 hover:-translate-y-1 hover:shadow-lg ${item.accent}`}
        >
          <p className="m-0 text-[12px] font-black uppercase tracking-wider text-slate-500">{item.label}</p>
          <strong className="mt-1 text-[36px] font-black tracking-tight text-[#0f172a]">{item.value}</strong>
        </article>
      ))}
    </section>
  );
}
