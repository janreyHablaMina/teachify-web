import type { PlanMeta, PlanTier } from "./types";

export const PLAN_CATALOG: Record<PlanTier, PlanMeta> = {
  trial: {
    label: "Free Plan",
    priceLabel: "Free",
    description: "Great for teachers who want to try Teachify AI and experience automatic quiz generation.",
    quizLimitLabel: "3 AI quiz generations total",
    maxQuestions: 10,
    features: [
      "3 AI quiz generations total",
      "Up to 10 questions per quiz",
      "Multiple choice questions",
      "Basic PDF export",
    ],
    limitations: ["No classroom features", "No document upload"],
  },
  basic: {
    label: "Basic Plan",
    priceLabel: "$7/month",
    description: "Ideal for teachers who need AI quiz generation without classroom management.",
    quizLimitLabel: "50 quizzes per month",
    maxQuestions: 50,
    features: ["50 quizzes per month", "Up to 50 questions per quiz", "Document to quiz generation", "Question bank"],
    limitations: ["No classroom management", "No analytics"],
  },
  pro: {
    label: "Pro Plan",
    priceLabel: "$14/month",
    description: "Complete AI assistant for teachers who manage quizzes, classrooms, and performance.",
    quizLimitLabel: "200 quizzes per month",
    maxQuestions: 50,
    features: [
      "Classrooms",
      "Everything in Basic",
      "200 quizzes per month",
      "Classroom creation + join codes",
      "Assignments and grading",
      "Student performance analytics",
    ],
    limitations: [],
  },
  school: {
    label: "School Plan",
    priceLabel: "$59/month",
    description: "For schools that want AI teaching tools across multiple teachers and classrooms.",
    quizLimitLabel: "Up to 1000 quizzes per month",
    maxQuestions: 100,
    features: [
      "Up to 20 teachers",
      "Up to 1000 quizzes per month",
      "Unlimited classrooms",
      "School admin dashboard",
      "Priority AI processing",
    ],
    limitations: [],
  },
};

export function normalizePlanTier(value?: string): PlanTier {
  const v = (value ?? "trial").toLowerCase();
  if (v === "free") return "trial";
  if (v === "basic" || v === "pro" || v === "school" || v === "trial") return v;
  return "trial";
}

export const DASHBOARD_BTN_BASE =
  "inline-flex items-center justify-center rounded-[10px] border-2 border-slate-900 px-[14px] py-[11px] text-[12px] font-black uppercase tracking-[0.06em] text-slate-900 shadow-[4px_4px_0_#0f172a]";
