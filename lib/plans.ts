export type PlanTier = "trial" | "basic" | "pro" | "school";

export type PlanConfig = {
  tier: PlanTier;
  label: string;
  priceLabel: string;
  quizLimitLabel: string;
  maxQuestions: number;
  hasClassrooms: boolean;
  features: string[];
};

export const PLAN_CATALOG: Record<PlanTier, PlanConfig> = {
  trial: {
    tier: "trial",
    label: "Free Plan",
    priceLabel: "Free",
    quizLimitLabel: "3 AI quiz generations (total)",
    maxQuestions: 10,
    hasClassrooms: false,
    features: [
      "3 AI quiz generations (total)",
      "Up to 10 questions per quiz",
      "Multiple choice questions",
      "Basic quiz export (PDF)",
      "Access to quiz generator",
    ],
  },
  basic: {
    tier: "basic",
    label: "Basic Plan",
    priceLabel: "$7/month",
    quizLimitLabel: "50 quizzes per month",
    maxQuestions: 50,
    hasClassrooms: false,
    features: [
      "50 quizzes per month",
      "Up to 50 questions per quiz",
      "Multiple choice, True/False, Short answer, Essay",
      "Document -> Quiz generation (PDF, DOCX, PPTX)",
      "Quiz export (PDF, DOCX)",
      "Question difficulty control",
      "Question bank",
    ],
  },
  pro: {
    tier: "pro",
    label: "Pro Plan",
    priceLabel: "$14/month",
    quizLimitLabel: "200 quizzes per month",
    maxQuestions: 50,
    hasClassrooms: true,
    features: [
      "Everything in Basic",
      "200 quizzes per month",
      "Up to 50 questions per quiz",
      "Classroom creation and student join codes",
      "Assignments, deadlines, and submissions",
      "Auto-grading for objective questions",
      "Essay grading review",
      "Student performance analytics",
      "Randomized questions and anti-cheat mode",
      "Teacher dashboard",
    ],
  },
  school: {
    tier: "school",
    label: "School Plan",
    priceLabel: "$59/month",
    quizLimitLabel: "Up to 1000 quizzes per month (shared)",
    maxQuestions: 50,
    hasClassrooms: true,
    features: [
      "Everything in Pro",
      "Up to 20 teachers",
      "Up to 1000 quizzes per month (shared)",
      "Up to 50 questions per quiz",
      "Unlimited classrooms",
      "School admin dashboard",
      "Shared question bank",
      "School branding",
      "Student management",
      "School-level analytics",
      "Priority AI processing",
    ],
  },
};

export function normalizePlanTier(plan?: string | null): PlanTier {
  if (plan === "basic" || plan === "pro" || plan === "school" || plan === "trial") {
    return plan;
  }

  if (plan === "free") {
    return "trial";
  }

  return "trial";
}
