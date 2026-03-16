"use client";

import { RevenueMetrics } from "@/components/admin/revenue/revenue-metrics";
import { RevenueChart } from "@/components/admin/revenue/revenue-chart";
import { PlanMixDistribution } from "@/components/admin/revenue/plan-mix-distribution";

export default function RevenueDashboardPage() {
  return (
    <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="m-0 text-[13px] font-bold uppercase tracking-[0.1em] text-slate-500">Admin / Financials</p>
            <h2 className="mt-1 text-[32px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">Business Growth</h2>
          </div>
        </header>

        {/* Actionable Metrics */}
        <RevenueMetrics />

        {/* Insights Section */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RevenueChart />
          <PlanMixDistribution />
        </div>
      </div>
    </main>
  );
}
