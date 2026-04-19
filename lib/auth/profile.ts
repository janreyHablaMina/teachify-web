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
  id?: number;
  createdAt?: string;

  // Identity & Personalization
  displayName?: string;
  bio?: string;
  school?: string;
  subjects?: string[];
  teachingLevel?: string;
  profilePhotoPath?: string;
  profilePhotoUrl?: string;

  // AI Preferences
  aiDefaultDifficulty?: "easy" | "medium" | "hard";
  aiDefaultQuestionType?: string;
  aiLanguage?: string;
  aiTone?: string;
  aiGenerateExplanations?: boolean;
  aiIncludeRationale?: boolean;

  // Notification Settings
  notifyEmail?: boolean;
  notifyQuizCompleted?: boolean;
  notifyStudentSubmission?: boolean;
  notifyWeeklySummary?: boolean;

  // UI Preferences
  uiTheme?: "light" | "dark";
  uiAccentColor?: string;
  uiDensity?: "comfortable" | "compact";

  // Security
  twoFactorEnabled?: boolean;
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
    id: readNumber(user.id ?? root.id),
    createdAt: readString(user.created_at ?? root.created_at),

    // Identity
    displayName: readString(user.display_name, root.display_name),
    bio: readString(user.bio),
    school: readString(user.school),
    subjects: Array.isArray(user.subjects) ? (user.subjects as string[]) : undefined,
    teachingLevel: readString(user.teaching_level),
    profilePhotoPath: readString(user.profile_photo_path, root.profile_photo_path),
    profilePhotoUrl: readString(user.profile_photo_url, root.profile_photo_url),

    // AI
    aiDefaultDifficulty: (readString(user.ai_default_difficulty) as any) ?? "medium",
    aiDefaultQuestionType: readString(user.ai_default_question_type) ?? "mixed",
    aiLanguage: readString(user.ai_language) ?? "English",
    aiTone: readString(user.ai_tone) ?? "Formal",
    aiGenerateExplanations: !!(user.ai_generate_explanations ?? true),
    aiIncludeRationale: !!(user.ai_include_rationale ?? true),

    // Notifications
    notifyEmail: !!(user.notify_email ?? true),
    notifyQuizCompleted: !!(user.notify_quiz_completed ?? true),
    notifyStudentSubmission: !!(user.notify_student_submission ?? true),
    notifyWeeklySummary: !!(user.notify_weekly_summary ?? true),

    // UI
    uiTheme: (readString(user.ui_theme) as any) ?? "light",
    uiAccentColor: readString(user.ui_accent_color) ?? "#0f172a",
    uiDensity: (readString(user.ui_density) as any) ?? "comfortable",

    // Security
    twoFactorEnabled: !!(user.two_factor_enabled ?? false),
  };
}
