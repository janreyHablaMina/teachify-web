import type { PlanMeta, PlanTier } from "./types";
import { DASHBOARD_BTN_BASE } from "./plan";

type PlanFeaturesPanelProps = {
  planMeta: PlanMeta;
  planTier: PlanTier;
};

export function PlanFeaturesPanel({ planMeta, planTier }: PlanFeaturesPanelProps) {
  const upgradeCopy =
    planTier === "trial"
      ? "Upgrade to Basic to unlock document upload and more monthly quiz generations."
      : planTier === "basic"
        ? "Upgrade to Pro to unlock classrooms, assignments, and student analytics."
        : "Upgrade to School for multi-teacher management and institutional controls.";

  return (
    <article className="flex flex-col gap-[14px] rounded-[18px] border border-slate-900/10 bg-white p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <h4 className="m-0 text-[20px] font-black tracking-[-0.02em] text-slate-900">Current Plan Features</h4>
      </div>
      <p className="m-0 text-[12px] font-bold leading-[1.45] text-slate-600">{planMeta.description}</p>
      <div className="grid gap-2.5">
        {planMeta.features.slice(0, 6).map((feature) => (
          <div key={feature} className="rounded-xl border border-slate-900/10 bg-slate-50 px-[13px] py-3 text-[14px] font-bold text-slate-900">
            {feature}
          </div>
        ))}
      </div>
      {planMeta.limitations.length > 0 ? (
        <div className="grid gap-2">
          <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Limitations</p>
          {planMeta.limitations.map((item) => (
            <div key={item} className="rounded-xl border border-dashed border-slate-900/20 bg-white px-[13px] py-2 text-[13px] font-extrabold text-slate-700">
              {item}
            </div>
          ))}
        </div>
      ) : null}
      <p className="m-0 text-[12px] font-bold leading-[1.45] text-slate-600">{upgradeCopy}</p>
      <button type="button" className={`${DASHBOARD_BTN_BASE} w-fit bg-yellow-200`}>
        Upgrade Plan
      </button>
    </article>
  );
}
