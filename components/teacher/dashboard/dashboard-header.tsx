import type { PlanMeta, PlanTier } from "./types";

type DashboardHeaderProps = {
  planTier: PlanTier;
  planMeta: PlanMeta;
};

export function DashboardHeader({ planTier, planMeta }: DashboardHeaderProps) {
  return (
    <header className="flex items-start justify-between">
      <div>
        <p className="m-0 text-[12px] font-extrabold uppercase tracking-[0.09em] text-slate-500">Dashboard / Overview</p>
        <h2 className="mt-1 text-[32px] font-black tracking-[-0.03em] text-slate-900">{planMeta.label} Dashboard</h2>
        <p className="mt-2 max-w-[760px] text-[14px] font-bold leading-[1.5] text-slate-700">
          {planTier.toUpperCase()} - {planMeta.priceLabel}: access your current plan features and usage in one place.
        </p>
      </div>
    </header>
  );
}
