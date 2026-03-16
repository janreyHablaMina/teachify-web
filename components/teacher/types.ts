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

export type TeacherMetric = {
  title: string;
  value: string | number;
};
