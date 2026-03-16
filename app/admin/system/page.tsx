"use client";

import { SystemMetrics } from "@/components/admin/system/system-metrics";
import { SystemAlerts } from "@/components/admin/system/system-alerts";

export default function SystemMonitoringPage() {
  return (
    <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="m-0 text-[13px] font-bold uppercase tracking-[0.1em] text-slate-500">Admin / System Monitoring</p>
            <h2 className="mt-1 text-[32px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">Platform Health</h2>
          </div>
        </header>

        {/* Real-time Health Metrics */}
        <SystemMetrics />

        {/* Infrastructure Alerts Panel */}
        <SystemAlerts />
      </div>
    </main>
  );
}
