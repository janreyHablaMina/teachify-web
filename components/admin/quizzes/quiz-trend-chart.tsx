"use client";

const dailyQuizTrend = [60, 45, 80, 55, 90, 70, 100, 85, 95, 75, 110, 105];

function heightOf(value: number, max: number) {
  return `${Math.max(12, Math.round((value / max) * 100))}%`;
}

export function QuizTrendChart() {
  const max = Math.max(...dailyQuizTrend);

  return (
    <article className="relative flex flex-col gap-6 overflow-hidden rounded-[24px] border border-slate-900/10 bg-white p-7 shadow-sm before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#e9d5ff]">
      <div className="flex items-center justify-between">
        <h4 className="m-0 text-[20px] font-black tracking-tight text-[#0f172a]">Quiz generation trend</h4>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-500">Last 12 cycles</span>
      </div>

      <div className="flex h-[210px] items-end gap-3 px-2">
        {dailyQuizTrend.map((value, index) => (
          <div key={`q-${index}`} className="group relative h-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-lg rounded-b-sm bg-gradient-to-b from-[#e9d5ff] to-[#9333ea] transition-all duration-300 hover:scale-x-110 hover:brightness-110"
              style={{ height: heightOf(value, max) }}
            >
              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[#0f172a] px-2 py-1 text-[10px] font-normal whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
                {Math.round((value / max) * 100)}% volume
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
