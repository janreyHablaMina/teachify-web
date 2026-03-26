import type { PlanMeta, PlanTier } from "./types";
import { DASHBOARD_BTN_BASE } from "./plan";
import { CheckCircle2, XCircle } from "lucide-react";

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
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="m-0 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Plan Snapshot</p>
        <h4 className="m-0 mt-1 text-[20px] font-black tracking-[-0.02em] text-slate-900">{planMeta.label}</h4>
        <p className="m-0 mt-1 text-[12px] font-bold leading-[1.45] text-slate-600">{planMeta.description}</p>
      </div>

      <div className="grid gap-2">
        <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-emerald-700">Included</p>
        {planMeta.features.slice(0, 4).map((feature) => (
          <div key={feature} className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 text-[13px] font-bold text-slate-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {planMeta.limitations.length > 0 ? (
        <div className="grid gap-2">
          <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-amber-800">Not Included</p>
          {planMeta.limitations.map((item) => (
            <div key={item} className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2.5 text-[13px] font-extrabold text-slate-700">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      ) : null}

      {(planTier === "trial" || planTier === "basic") ? (
        <div className="mt-1 rounded-xl border border-violet-200 bg-violet-50/70 p-3">
          <p className="m-0 text-[12px] font-bold leading-[1.45] text-slate-700">{upgradeCopy}</p>
          <button
            type="button"
            className={`${DASHBOARD_BTN_BASE.replace("shadow-[4px_4px_0_#0f172a]", "shadow-sm")} mt-3 w-fit bg-[#ede9fe]`}
          >
            Upgrade Plan
          </button>
        </div>
      ) : null}
    </article>
  );
}
