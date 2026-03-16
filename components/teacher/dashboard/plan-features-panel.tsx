import type { PlanMeta } from "./types";
import { DASHBOARD_BTN_BASE } from "./plan";

type PlanFeaturesPanelProps = {
  planMeta: PlanMeta;
};

export function PlanFeaturesPanel({ planMeta }: PlanFeaturesPanelProps) {
  return (
    <article className="flex flex-col gap-[14px] rounded-[18px] border border-slate-900/10 bg-white p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <h4 className="m-0 text-[20px] font-black tracking-[-0.02em] text-slate-900">Current Plan Features</h4>
      </div>
      <div className="grid gap-2.5">
        {planMeta.features.slice(0, 6).map((feature) => (
          <div key={feature} className="rounded-xl border border-slate-900/10 bg-slate-50 px-[13px] py-3 text-[14px] font-bold text-slate-900">
            {feature}
          </div>
        ))}
      </div>
      <p className="m-0 text-[12px] font-bold leading-[1.45] text-slate-600">Upgrade to Pro to unlock Classrooms, Student Analytics, and Assignments.</p>
      <button type="button" className={`${DASHBOARD_BTN_BASE} w-fit bg-yellow-200`}>
        Upgrade Plan
      </button>
    </article>
  );
}
