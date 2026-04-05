"use client";

import Link from "next/link";
import { CheckCircle2, Crown } from "lucide-react";
import { useTeacherSession } from "@/components/teacher/teacher-session-context";
import { PLAN_CATALOG, normalizePlanTier } from "@/components/teacher/dashboard/plan";

const PLAN_ORDER = ["trial", "basic", "pro", "school"] as const;

export default function TeacherUpgradePage() {
  const session = useTeacherSession();
  const currentPlanTier = normalizePlanTier(session?.planTier ?? session?.plan ?? "trial");

  return (
    <section className="w-full">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-[12px] font-black uppercase tracking-[0.09em] text-slate-500">Dashboard / Upgrade</p>
          <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] text-slate-900">Choose Your Plan</h2>
          <p className="mt-2 text-[15px] font-bold text-slate-500">
            Compare features and pick the best plan for your classroom workflow.
          </p>
        </div>
        <Link
          href="/teacher"
          className="rounded-xl border-2 border-[#0f172a] bg-white px-6 py-3 text-[13px] font-black uppercase tracking-wider text-[#0f172a] no-underline shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-1"
        >
          Back to Overview
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        {PLAN_ORDER.map((tier) => {
          const plan = PLAN_CATALOG[tier];
          const isCurrent = currentPlanTier === tier;
          const isUpgrade = PLAN_ORDER.indexOf(tier) > PLAN_ORDER.indexOf(currentPlanTier);

          return (
            <article
              key={tier}
              className={`relative flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm ${
                isCurrent ? "border-emerald-300 ring-4 ring-emerald-100" : "border-slate-200"
              }`}
            >
              {isCurrent ? (
                <span className="absolute -top-3 right-4 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-emerald-800">
                  Current Plan
                </span>
              ) : null}

              <div className="mb-4">
                <p className="m-0 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{tier.toUpperCase()}</p>
                <h3 className="mt-1 text-[24px] font-black tracking-[-0.02em] text-slate-900">{plan.label}</h3>
                <p className="m-0 mt-1 text-[13px] font-bold text-slate-600">{plan.priceLabel}</p>
                <p className="m-0 mt-2 text-[12px] font-semibold leading-[1.5] text-slate-600">{plan.description}</p>
              </div>

              <div className="grid gap-2">
                {plan.features.slice(0, 5).map((feature) => (
                  <div key={feature} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-[12px] font-bold text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-5">
                {isCurrent ? (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border-2 border-slate-300 bg-slate-100 px-4 py-3 text-[12px] font-black uppercase tracking-[0.08em] text-slate-500"
                  >
                    Active Plan
                  </button>
                ) : isUpgrade ? (
                  <a
                    href="mailto:billing@teachify.ai?subject=Teachify%20Plan%20Upgrade"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#0f172a] bg-[#fef08a] px-4 py-3 text-[12px] font-black uppercase tracking-[0.08em] text-[#0f172a] no-underline shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-1"
                  >
                    <Crown className="h-4 w-4" />
                    Upgrade to {tier.toUpperCase()}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border-2 border-slate-300 bg-slate-100 px-4 py-3 text-[12px] font-black uppercase tracking-[0.08em] text-slate-500"
                  >
                    Lower Plan
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
