type JsonObject = Record<string, unknown>;

export type TeacherProfile = {
  role: string;
  name: string;
  email: string;
  plan: string;
  planTier: string;
  planLabel: string;
  quizGenerationLimit?: number;
  quizzesUsed?: number;
  maxQuestionsPerQuiz?: number;
};

function toObject(value: unknown): JsonObject {
  return value && typeof value === "object" ? (value as JsonObject) : {};
}

function readString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

export function formatPlanLabel(plan: string): string {
  if (!plan) return "Free";
  const lower = plan.toLowerCase();
  if (lower === "trial" || lower === "free") return "Free";
  if (lower === "basic") return "Basic";
  if (lower === "pro") return "Pro";
  if (lower === "school") return "School";
  return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
}

export function parseTeacherProfile(payload: unknown): TeacherProfile {
  const root = toObject(payload);
  const user = toObject(root.user);

  const role = readString(user.role, root.role) ?? "";
  const name = readString(
    user.fullname,
    user.full_name,
    user.name,
    root.fullname,
    root.full_name,
    root.name
  ) ?? "Educator";
  const email = readString(user.email, root.email) ?? "";

  const rawPlan = readString(user.plan, root.plan) ?? "trial";
  const rawPlanTier = readString(user.plan_tier, root.plan_tier, rawPlan) ?? "trial";

  return {
    role,
    name,
    email,
    plan: rawPlan,
    planTier: rawPlanTier,
    planLabel: formatPlanLabel(rawPlanTier),
    quizGenerationLimit: readNumber(user.quiz_generation_limit ?? root.quiz_generation_limit),
    quizzesUsed: readNumber(user.quizzes_used ?? root.quizzes_used),
    maxQuestionsPerQuiz: readNumber(user.max_questions_per_quiz ?? root.max_questions_per_quiz),
  };
}
