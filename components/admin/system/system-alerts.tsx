"use client";

import { SystemAlert } from "./types";

const alerts: SystemAlert[] = [
  { title: "Queue backlog detected", detail: "Generation queue exceeded threshold at 34 pending jobs", tone: "warn" },
  { title: "AI API failure", detail: "Transient timeout spikes from upstream provider region", tone: "high" },
  { title: "High CPU usage", detail: "Worker cluster averaging 81% CPU for 14 minutes", tone: "warn" },
];

export function SystemAlerts() {
  return (
    <article className="relative flex flex-col gap-6 overflow-hidden rounded-[24px] border border-slate-900/10 bg-white p-7 shadow-sm before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#fda4af]">
      <div className="flex items-center justify-between">
        <h4 className="m-0 text-[24px] font-black tracking-tight text-[#0f172a]">Active Infrastructure Alerts</h4>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-500">Realtime Pulse</span>
      </div>

      <div className="flex flex-col gap-3">
        {alerts.map((alert) => {
          const isHigh = alert.tone === "high";
          const severityColor = isHigh ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
          const accentColor = isHigh ? "before:bg-red-500" : "before:bg-amber-500";
          
          return (
            <div
              key={alert.title}
              className={`group relative grid grid-cols-[auto_1fr] items-center gap-5 px-6 py-5 bg-white border border-slate-900/5 rounded-2xl transition-all hover:scale-[1.005] hover:-translate-y-0.5 hover:shadow-lg hover:z-10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${accentColor}`}
            >
              <div className={`h-3 w-3 rounded-full border-2 border-white ${severityColor}`} />
              <div className="flex flex-col">
                <p className="m-0 text-[15px] font-extrabold text-[#0f172a]">{alert.title}</p>
                <small className="mt-0.5 text-[13px] font-semibold text-slate-500">{alert.detail}</small>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
