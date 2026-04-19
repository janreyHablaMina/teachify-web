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

