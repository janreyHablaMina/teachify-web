"use client";

import type { CSSProperties } from "react";

const stats = [
  { label: "Active Schools", value: "124", trend: "+12 this month", accent: "#99f6e4" },
  { label: "Daily Learners", value: "42.8k", trend: "+3.2% vs yesterday", accent: "#fef08a" },
  { label: "Monthly Revenue", value: "$48.2k", trend: "115% of goal", accent: "#fda4af" },
  { label: "AI Generations", value: "890k", trend: "System optimal", accent: "#e9d5ff" },
];

const events = [
  { type: "Success", msg: "v2.5 deployment complete", time: "2m ago" },
  { type: "Warning", msg: "API usage spike detected", time: "15m ago" },
  { type: "Info", msg: "New school 'Westwood High' onboarded", time: "1h ago" },
  { type: "Info", msg: "Weekly backup successful", time: "4h ago" },
];

const schools = [
  { name: "Summit Ridge Academy", score: 98 },
  { name: "Lincoln Technical", score: 95 },
  { name: "Global Innovators High", score: 93 },
];

const badgeStyles: Record<string, string> = {
  Success: "bg-[#dcfce7] text-[#166534]",
  Warning: "bg-[#ffedd5] text-[#9a3412]",
  Info: "bg-[#e0f2fe] text-[#075985]",
};

export default function AdminDashboardPage() {
  return (
    <div
      className="relative isolate flex min-h-full w-full min-w-0 flex-col gap-8 py-2"
      style={
        {
          "--ink": "#0f172a",
          "--muted": "#64748b",
        } as CSSProperties
      }
    >
      <div className="flex items-center justify-between max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-4">
        <div>
          <p className="m-0 text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Admin / Dashboard</p>
          <h2 className="mt-1 text-[32px] font-extrabold tracking-[-0.03em] text-[var(--ink)]">Platform Pulse</h2>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-transparent bg-[var(--ink)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-px"
          >
            Download Analytics
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-[#e2e8f0] bg-white px-5 py-2.5 text-sm font-bold text-[var(--ink)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-px hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
          >
            System Settings
          </button>
        </div>
      </div>

      <section className="grid w-full min-w-0 gap-8">
        <div className="grid w-full min-w-0 grid-cols-4 gap-5 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative min-w-0 overflow-hidden rounded-[20px] border border-[rgba(226,232,240,0.8)] bg-white p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.04),0_4px_6px_-2px_rgba(0,0,0,0.02)] transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.165,0.84,0.44,1)] hover:-translate-y-[6px] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08)]"
              style={{ "--accent": stat.accent } as CSSProperties}
            >
              <div className="absolute left-0 top-0 h-1 w-full bg-[var(--accent)]" />
              <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.05em] text-[var(--muted)]">{stat.label}</div>
              <div className="mb-2 text-4xl font-black leading-none text-[var(--ink)]">{stat.value}</div>
              <div className="text-xs font-semibold text-[#10b981]">{stat.trend}</div>
            </div>
          ))}
        </div>

        <div className="grid w-full min-w-0 grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] gap-6 max-[1400px]:grid-cols-1">
          <div className="relative min-w-0 overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white p-7 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#99f6e4]" />

            <div className="mb-8 flex items-start justify-between">
              <div>
                <h4 className="relative inline-block text-[22px] font-black tracking-[-0.02em] text-[var(--ink)]">
                  Growth Velocity
                  <span className="absolute -bottom-1 left-0 h-[3px] w-10 rounded-full bg-[#99f6e4] opacity-60" />
                </h4>
                <p className="mt-1 text-sm text-[var(--muted)]">New registrations & teacher onboarding</p>
              </div>

              <select className="cursor-pointer rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-[13px] font-bold outline-none">
                <option>Last 30 Days</option>
                <option>Year to Date</option>
              </select>
            </div>

            <div className="relative flex h-60 items-end gap-3 px-[10px]">
              {[60, 45, 80, 55, 90, 70, 100, 85, 95, 75, 110, 105].map((height, i) => (
                <div
                  key={i}
                  className="group relative min-h-[10px] flex-1 rounded-[6px_6px_2px_2px] bg-[linear-gradient(180deg,#99f6e4_0%,#14b8a6_100%)] transition-all duration-300 hover:scale-x-110 hover:brightness-110"
                  style={{ height: `${height}%` }}
                >
                  <div className="pointer-events-none absolute -top-[30px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--ink)] px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Day {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-w-0 overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white p-7 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#fda4af]" />

            <div className="mb-8">
              <h4 className="relative inline-block text-[22px] font-black tracking-[-0.02em] text-[var(--ink)]">
                Realtime Events
                <span className="absolute -bottom-1 left-0 h-[3px] w-10 rounded-full bg-[#99f6e4] opacity-60" />
              </h4>
            </div>

            <div className="grid gap-4">
              {events.map((item, i) => (
                <div
                  key={i}
                  className="flex min-w-0 gap-4 rounded-xl border border-transparent bg-[#f8fafc] p-3 transition-all duration-200 hover:border-[#e2e8f0] hover:bg-white"
                >
                  <span
                    className={`h-fit rounded-md px-2.5 py-1 text-[10px] font-black uppercase ${badgeStyles[item.type] ?? badgeStyles.Info}`}
                  >
                    {item.type}
                  </span>
                  <div className="min-w-0">
                    <p className="m-0 text-sm font-bold text-[var(--ink)]">{item.msg}</p>
                    <small className="text-xs text-[var(--muted)]">{item.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 max-[1400px]:grid-cols-1">
          <div className="relative min-w-0 overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#fef08a]" />
            <h4 className="mb-6 text-lg font-extrabold text-[var(--ink)]">System Health</h4>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase text-[var(--muted)]">Uptime</span>
                <strong className="text-[20px] font-extrabold text-[var(--ink)]">99.99%</strong>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase text-[var(--muted)]">API Latency</span>
                <strong className="text-[20px] font-extrabold text-[var(--ink)]">42ms</strong>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase text-[var(--muted)]">Open Tickets</span>
                <strong className="text-[20px] font-extrabold text-[var(--ink)]">14</strong>
              </div>
            </div>
          </div>

          <div className="relative min-w-0 overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#e9d5ff]" />
            <h4 className="mb-6 text-lg font-extrabold text-[var(--ink)]">Top Performing Schools</h4>

            <div className="grid gap-3">
              {schools.map((school, i) => (
                <div key={i} className="flex items-center justify-between gap-4 rounded-xl bg-[#f8fafc] px-4 py-3">
                  <span className="min-w-0 text-sm font-bold text-[var(--ink)]">{school.name}</span>
                  <strong className="shrink-0 text-sm font-extrabold text-[var(--muted)]">
                    {school.score}% <small className="text-[11px] font-medium">engagement</small>
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
