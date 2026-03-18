export type PlanTier = "trial" | "basic" | "pro" | "school";

export type PlanMeta = {
  label: string;
  priceLabel: string;
  description: string;
  quizLimitLabel: string;
  quizLimit: number;
  maxQuestions: number;
  features: string[];
  limitations: string[];
};

export type TeacherPlanUser = {
  plan?: string;
  plan_tier?: string;
  quiz_generation_limit?: number;
  quizzes_used?: number;
  max_questions_per_quiz?: number;
};

export type QuizSummary = {
  id: number;
  title: string;
  created_at: string;
};

export type ClassroomSummary = {
  is_active?: boolean;
};
