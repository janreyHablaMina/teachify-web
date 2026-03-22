import type { PlanMeta, PlanTier } from "./types";

type DashboardHeaderProps = {
  planTier: PlanTier;
  planMeta: PlanMeta;
  userName?: string;
  userEmail?: string;
};

export function DashboardHeader({ planTier, planMeta, userName, userEmail }: DashboardHeaderProps) {
  const planTierLabel = planTier === "trial" ? "FREE" : planTier.toUpperCase();

  return (
    <header className="flex items-start justify-between">
      <div>
        <p className="m-0 text-[12px] font-extrabold uppercase tracking-[0.09em] text-slate-500">Dashboard / Overview</p>
        <h2 className="mt-1 text-[32px] font-black tracking-[-0.03em] text-slate-900">
          {userName ? `Welcome back, ${userName}` : "Dashboard Overview"}
        </h2>
      </div>
    </header>
  );
}
