export type NotificationCategory =
  | "system"
  | "plan"
  | "ai_activity"
  | "classroom"
  | "engagement";

export type NotificationEventType =
  | "limits_reached"
  | "plan_updates"
  | "quiz_generated"
  | "generation_failed"
  | "student_joined"
  | "quiz_submitted"
  | "weekly_summary"
  | "suggestions"
  | "payment_required"
  | "system_notice";

export type NotificationSeverity = "info" | "warning" | "success" | "critical";

export type TeacherNotification = {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  eventType: NotificationEventType;
  severity: NotificationSeverity;
  createdAt: string;
  read: boolean;
};

const RAW_NOTIFICATIONS: TeacherNotification[] = [
  {
    id: "n001",
    title: "John submitted your quiz",
    message: "John submitted \"Math Quiz 1\".",
    category: "classroom",
    eventType: "quiz_submitted",
    severity: "info",
    createdAt: "2026-04-19T08:28:00.000Z",
    read: false,
  },
  {
    id: "n002",
    title: "Quiz generated successfully",
    message: "Your latest AI quiz draft is ready to review.",
    category: "ai_activity",
    eventType: "quiz_generated",
    severity: "success",
    createdAt: "2026-04-19T07:46:00.000Z",
    read: false,
  },
  {
    id: "n003",
    title: "You have 1 quiz generation left",
    message: "Upgrade your plan to avoid interruptions.",
    category: "plan",
    eventType: "limits_reached",
    severity: "warning",
    createdAt: "2026-04-19T06:49:00.000Z",
    read: false,
  },
  {
    id: "n004",
    title: "5 students joined your class",
    message: "Classroom \"Algebra A\" had 5 new student joins.",
    category: "classroom",
    eventType: "student_joined",
    severity: "info",
    createdAt: "2026-04-19T05:35:00.000Z",
    read: false,
  },
  {
    id: "n005",
    title: "Quiz generation failed",
    message: "AI service timed out. Retry with fewer questions.",
    category: "ai_activity",
    eventType: "generation_failed",
    severity: "critical",
    createdAt: "2026-04-18T15:10:00.000Z",
    read: false,
  },
  {
    id: "n006",
    title: "Plan usage warning",
    message: "You are at 90% of your monthly generation quota.",
    category: "plan",
    eventType: "plan_updates",
    severity: "warning",
    createdAt: "2026-04-18T12:05:00.000Z",
    read: true,
  },
  {
    id: "n007",
    title: "Upgrade suggestion",
    message: "School plan unlocks unlimited classes and analytics.",
    category: "engagement",
    eventType: "suggestions",
    severity: "info",
    createdAt: "2026-04-18T07:25:00.000Z",
    read: true,
  },
  {
    id: "n008",
    title: "Weekly summary is ready",
    message: "See class engagement and quiz completion trends.",
    category: "engagement",
    eventType: "weekly_summary",
    severity: "success",
    createdAt: "2026-04-17T16:45:00.000Z",
    read: true,
  },
  {
    id: "n009",
    title: "System update completed",
    message: "Background sync improvements were applied.",
    category: "system",
    eventType: "system_notice",
    severity: "success",
    createdAt: "2026-04-17T09:20:00.000Z",
    read: true,
  },
  {
    id: "n010",
    title: "Payment required to continue",
    message: "Your trial ended. Update billing to keep generating quizzes.",
    category: "system",
    eventType: "payment_required",
    severity: "critical",
    createdAt: "2026-04-16T13:55:00.000Z",
    read: false,
  },
  {
    id: "n011",
    title: "New submission spike",
    message: "12 quizzes were submitted in the last 2 hours.",
    category: "classroom",
    eventType: "quiz_submitted",
    severity: "info",
    createdAt: "2026-04-16T04:15:00.000Z",
    read: true,
  },
  {
    id: "n012",
    title: "AI model optimization",
    message: "Generation quality for short-answer improved.",
    category: "ai_activity",
    eventType: "plan_updates",
    severity: "info",
    createdAt: "2026-04-15T10:30:00.000Z",
    read: true,
  },
];

export const NOTIFICATION_TYPE_LABELS: Record<NotificationEventType, string> = {
  limits_reached: "Limits Reached",
  plan_updates: "Plan Updates",
  quiz_generated: "Quiz Generated",
  generation_failed: "Generation Failed",
  student_joined: "Student Joined",
  quiz_submitted: "Quiz Submitted",
  weekly_summary: "Weekly Summary",
  suggestions: "Suggestions",
  payment_required: "Payment Required",
  system_notice: "System Notice",
};

export const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  system: "System",
  plan: "Plan Updates",
  ai_activity: "AI Activity",
  classroom: "Classroom",
  engagement: "Engagement",
};

export function getInitialTeacherNotifications(): TeacherNotification[] {
  return RAW_NOTIFICATIONS.map((item) => ({ ...item }));
}

export function formatNotificationTime(value: string): string {
  const now = Date.now();
  const then = new Date(value).getTime();
  const diffMs = now - then;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    const mins = Math.max(1, Math.floor(diffMs / minute));
    return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  }

  if (diffMs < day) {
    const hours = Math.max(1, Math.floor(diffMs / hour));
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (diffMs < day * 2) return "Yesterday";

  const days = Math.max(2, Math.floor(diffMs / day));
  if (days < 7) return `${days} days ago`;

  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
