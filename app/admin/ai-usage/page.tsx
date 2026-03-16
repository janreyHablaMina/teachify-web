"use client";

import { AIMetrics } from "@/components/admin/ai-usage/ai-metrics";
import { AIUsageTable } from "@/components/admin/ai-usage/ai-usage-table";

export default function AIUsageMonitoringPage() {
  return (
    <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="m-0 text-[13px] font-bold uppercase tracking-[0.1em] text-slate-500">Admin / AI Usage</p>
            <h2 className="mt-1 text-[32px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">Monitor Consumption</h2>
          </div>
        </header>

        {/* Actionable Metrics */}
        <AIMetrics />

        {/* Detailed Logs Panel */}
        <section className="flex flex-col gap-6">
          <AIUsageTable />
        </section>
      </div>
    </main>
  );
}
