"use client";

import Link from "next/link";
import { CheckCircle2, Crown } from "lucide-react";
import { useTeacherSession } from "@/components/teacher/teacher-session-context";
import { PLAN_CATALOG, normalizePlanTier } from "@/components/teacher/dashboard/plan";

const PLAN_ORDER = ["trial", "basic", "pro", "school"] as const;
const PLAN_THEME = {
  trial: {
    card: "border-amber-300 bg-[linear-gradient(180deg,#fffbeb_0%,#fff7ed_100%)]",
    badge: "border-amber-300 bg-amber-100 text-amber-800",
    feature: "border-amber-200 bg-white/80",
    icon: "text-amber-600",
    cta: "border-amber-300 bg-amber-100 text-amber-800",
  },
  basic: {
    card: "border-teal-300 bg-[linear-gradient(180deg,#ecfeff_0%,#f0fdfa_100%)]",
    badge: "border-teal-300 bg-teal-100 text-teal-800",
    feature: "border-teal-200 bg-white/80",
    icon: "text-teal-600",
    cta: "border-teal-500 bg-teal-200 text-teal-900 shadow-[3px_3px_0_#0f766e]",
  },
  pro: {
    card: "border-indigo-300 bg-[linear-gradient(180deg,#eef2ff_0%,#f5f3ff_100%)]",
    badge: "border-indigo-300 bg-indigo-100 text-indigo-800",
    feature: "border-indigo-200 bg-white/80",
    icon: "text-indigo-600",
    cta: "border-indigo-500 bg-indigo-200 text-indigo-900 shadow-[3px_3px_0_#4338ca]",
  },
  school: {
    card: "border-rose-300 bg-[linear-gradient(180deg,#fff1f2_0%,#fef2f2_100%)]",
    badge: "border-rose-300 bg-rose-100 text-rose-800",
    feature: "border-rose-200 bg-white/80",
    icon: "text-rose-600",
    cta: "border-rose-500 bg-rose-200 text-rose-900 shadow-[3px_3px_0_#be123c]",
  },
} as const;

export default function TeacherUpgradePage() {
  const session = useTeacherSession();
  const currentPlanTier = normalizePlanTier(session?.planTier ?? session?.plan ?? "trial");

  return (
    <section className="w-full">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[linear-gradient(120deg,#ffffff_0%,#ecfeff_50%,#fef3c7_100%)] p-5 shadow-sm">
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
          const theme = PLAN_THEME[tier];
          const isCurrent = currentPlanTier === tier;
          const isUpgrade = PLAN_ORDER.indexOf(tier) > PLAN_ORDER.indexOf(currentPlanTier);

          return (
            <article
              key={tier}
              className={`relative flex h-full flex-col rounded-2xl border p-5 shadow-sm transition-transform hover:-translate-y-1 ${
                isCurrent ? `${theme.card} ring-4 ring-emerald-100` : theme.card
              }`}
            >
              {isCurrent ? (
                <span className={`absolute -top-3 right-4 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${theme.badge}`}>
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
                  <div key={feature} className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${theme.feature}`}>
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${theme.icon}`} />
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
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-[12px] font-black uppercase tracking-[0.08em] no-underline transition hover:-translate-y-1 ${theme.cta}`}
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
