import type { PlanMeta, PlanTier } from "./types";

export const PLAN_CATALOG: Record<PlanTier, PlanMeta> = {
  trial: {
    label: "Free Plan",
    priceLabel: "Free",
    quizLimitLabel: "3 quiz generations/month",
    maxQuestions: 10,
    features: ["AI quiz generation", "Multiple question types", "Basic editing", "Export options"],
  },
  basic: {
    label: "Basic Plan",
    priceLabel: "$7/month",
    quizLimitLabel: "30 quiz generations/month",
    maxQuestions: 20,
    features: ["Everything in Free", "Higher monthly limit", "More question capacity", "Priority generation"],
  },
  pro: {
    label: "Pro Plan",
    priceLabel: "$14/month",
    quizLimitLabel: "200 quiz generations/month",
    maxQuestions: 50,
    features: [
      "Classrooms",
      "Student Analytics",
      "Assignments",
      "Advanced teacher workflow",
      "Priority support",
      "Enhanced exports",
    ],
  },
  school: {
    label: "School Plan",
    priceLabel: "$49/month",
    quizLimitLabel: "Unlimited quiz generations",
    maxQuestions: 100,
    features: [
      "All Pro features",
      "Multi-teacher workspace",
      "Centralized analytics",
      "Institution controls",
      "Shared question bank",
      "Priority support",
    ],
  },
};

export function normalizePlanTier(value?: string): PlanTier {
  const v = (value ?? "trial").toLowerCase();
  if (v === "basic" || v === "pro" || v === "school" || v === "trial") return v;
  return "trial";
}

export const DASHBOARD_BTN_BASE =
  "inline-flex items-center justify-center rounded-[10px] border-2 border-slate-900 px-[14px] py-[11px] text-[12px] font-black uppercase tracking-[0.06em] text-slate-900 shadow-[4px_4px_0_#0f172a]";
