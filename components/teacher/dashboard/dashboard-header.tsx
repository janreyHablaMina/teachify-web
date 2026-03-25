import type { PlanMeta, PlanTier } from "./types";

type DashboardHeaderProps = {
  planTier: PlanTier;
  planMeta: PlanMeta;
  userName?: string;
  userEmail?: string;
};

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <header className="flex items-start justify-between">
      <div>
        <p className="text-[12px] font-black uppercase tracking-[0.09em] text-slate-500 mb-1">Dashboard / Overview</p>
        <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] text-slate-900">
          {userName ? `Welcome back, ${userName}` : "Dashboard Overview"}
        </h2>
      </div>
    </header>
  );
}
