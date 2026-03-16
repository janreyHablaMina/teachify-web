import { growthHeights, realtimeEvents, statCards, topSchools } from "./data";

export function AdminDashboard() {
  return (
    <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="m-0 text-[13px] font-normal uppercase tracking-[0.1em] text-slate-500">Admin / Dashboard</p>
            <h2 className="mt-1 text-[32px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">Platform Pulse</h2>
          </div>
          <div className="flex gap-3">
            <button className="rounded-lg bg-[#0f172a] px-5 py-2.5 text-sm font-normal text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">Download Analytics</button>
            <button className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-normal text-[#0f172a] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">System Settings</button>
          </div>
        </div>

        <section className="grid gap-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <article
                key={card.title}
                className={`relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.04),0_4px_6px_-2px_rgba(0,0,0,0.02)] before:absolute before:top-0 before:left-0 before:h-1 before:w-full ${card.accent}`}
              >
                <p className="mb-3 text-xs font-normal uppercase tracking-[0.05em] text-slate-500">{card.title}</p>
                <p className="mb-2 text-[36px] font-normal leading-none text-[#0f172a]">{card.value}</p>
                <p className="text-xs font-normal text-emerald-500">{card.note}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-6 2xl:grid-cols-[1.8fr_1fr]">
            <article className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-7 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] before:absolute before:top-0 before:left-0 before:h-1 before:w-full before:bg-[#99f6e4]">
              <div className="mb-8 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-[22px] font-black tracking-[-0.02em] text-[#0f172a]">Growth Velocity</h4>
                  <p className="mt-1 text-sm text-slate-500">New registrations & teacher onboarding</p>
                </div>
                <select className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] font-normal outline-none">
                  <option>Last 30 Days</option>
                  <option>Year to Date</option>
                </select>
              </div>

              <div className="flex h-[240px] items-end gap-3 px-2">
                {growthHeights.map((h, i) => (
                  <div
                    key={i}
                    className="group relative flex-1 rounded-t-[6px] rounded-b-[2px] bg-gradient-to-b from-[#99f6e4] to-[#14b8a6] transition hover:brightness-110"
                    style={{ height: `${h}%` }}
                  >
                    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[#0f172a] px-2 py-1 text-[10px] font-normal whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
                      Day {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-7 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] before:absolute before:top-0 before:left-0 before:h-1 before:w-full before:bg-[#fda4af]">
              <div className="mb-8">
                <h4 className="relative inline-block text-[22px] font-black tracking-[-0.02em] text-[#0f172a] after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:w-10 after:rounded-full after:bg-[#99f6e4] after:opacity-60">
                  Realtime Events
                </h4>
              </div>
              <div className="grid gap-4">
                {realtimeEvents.map((event) => (
                  <div key={`${event.msg}-${event.time}`} className="flex gap-4 rounded-xl border border-transparent bg-slate-50 p-3 transition hover:border-slate-200 hover:bg-white">
                    <span className={`h-fit rounded-md px-2.5 py-1 text-[10px] font-normal uppercase ${event.style}`}>{event.type}</span>
                    <div>
                      <p className="m-0 text-sm font-normal text-[#0f172a]">{event.msg}</p>
                      <small className="text-xs text-slate-500">{event.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="grid gap-6 2xl:grid-cols-[1fr_1.2fr]">
            <article className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] before:absolute before:top-0 before:left-0 before:h-1 before:w-full before:bg-[#fef08a]">
              <h4 className="mb-6 text-lg font-black text-[#0f172a]">System Health</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-normal uppercase text-slate-500">Uptime</span>
                  <strong className="text-2xl font-normal text-[#0f172a]">99.99%</strong>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-normal uppercase text-slate-500">API Latency</span>
                  <strong className="text-2xl font-normal text-[#0f172a]">42ms</strong>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-normal uppercase text-slate-500">Open Tickets</span>
                  <strong className="text-2xl font-normal text-[#0f172a]">14</strong>
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] before:absolute before:top-0 before:left-0 before:h-1 before:w-full before:bg-violet-200">
              <h4 className="mb-6 text-lg font-black text-[#0f172a]">Top Performing Schools</h4>
              <div className="grid gap-3">
                {topSchools.map((school) => (
                  <div key={school.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm font-normal text-[#0f172a]">{school.name}</span>
                    <strong className="text-sm font-normal text-slate-500">
                      {school.score}% <small className="text-xs font-medium">engagement</small>
                    </strong>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
