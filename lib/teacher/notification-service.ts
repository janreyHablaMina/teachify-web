import type { TeacherProfile } from "@/lib/auth/profile";
import { apiGetClassroom, apiGetClassrooms, apiGetNotifications, apiGetQuizzes } from "@/lib/api/client";
import type {
  NotificationCategory,
  NotificationEventType,
  NotificationSeverity,
  TeacherNotification,
} from "@/components/teacher/notifications/mock-data";

type JsonObject = Record<string, unknown>;

type ClassroomSummary = {
  id: number;
  name: string;
  students_count?: number;
};

type QuizSummary = {
  id: number;
  title?: string;
  created_at?: string;
};

type ClassroomDetails = {
  assignments?: Array<{
    status_counts?: {
      submitted?: number;
    } | null;
  }>;
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

function mapCategory(value?: string): NotificationCategory {
  const normalized = (value ?? "").toLowerCase();
  if (normalized.includes("class")) return "classroom";
  if (normalized.includes("plan") || normalized.includes("limit")) return "plan";
  if (normalized.includes("ai")) return "ai_activity";
  if (normalized.includes("engage") || normalized.includes("suggest")) return "engagement";
  return "system";
}

function mapEventType(value?: string): NotificationEventType {
  const normalized = (value ?? "").toLowerCase();
  if (normalized.includes("limit")) return "limits_reached";
  if (normalized.includes("plan")) return "plan_updates";
  if (normalized.includes("generated") || normalized.includes("success")) return "quiz_generated";
  if (normalized.includes("failed") || normalized.includes("error")) return "generation_failed";
  if (normalized.includes("join")) return "student_joined";
  if (normalized.includes("submit")) return "quiz_submitted";
  if (normalized.includes("weekly")) return "weekly_summary";
  if (normalized.includes("suggest")) return "suggestions";
  if (normalized.includes("payment") || normalized.includes("billing")) return "payment_required";
  return "system_notice";
}

function mapSeverity(value?: string): NotificationSeverity {
  const normalized = (value ?? "").toLowerCase();
  if (normalized.includes("critical") || normalized.includes("danger") || normalized.includes("error")) return "critical";
  if (normalized.includes("warning") || normalized.includes("warn")) return "warning";
  if (normalized.includes("success")) return "success";
  return "info";
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "y"].includes(normalized)) return true;
    if (["0", "false", "no", "n"].includes(normalized)) return false;
  }
  return false;
}

function normalizeApiNotification(raw: unknown): TeacherNotification | null {
  const item = toObject(raw);
  const id = readString(item.id, item.uuid);
  const message = readString(item.message, item.body, item.text);
  const title = readString(item.title, item.subject, item.type, item.category);
  const createdAt = readString(item.created_at, item.createdAt);
  if (!id || !message || !createdAt) return null;

  const category = mapCategory(readString(item.category, item.group, item.namespace));
  const eventType = mapEventType(readString(item.type, item.event_type, item.eventType));
  const severity = mapSeverity(readString(item.severity, item.level, item.status));
  const read = parseBoolean(item.read ?? item.is_read ?? item.read_at);

  return {
    id,
    title: title ?? "Notification",
    message,
    category,
    eventType,
    severity,
    createdAt,
    read,
  };
}

function sortByCreatedAtDesc(items: TeacherNotification[]): TeacherNotification[] {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function makeNotification(input: {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  eventType: NotificationEventType;
  severity: NotificationSeverity;
  createdAt: string;
}): TeacherNotification {
  return {
    ...input,
    read: false,
  };
}

async function tryFetchCanonicalNotifications(token: string): Promise<TeacherNotification[]> {
  try {
    const { response, data } = await apiGetNotifications<unknown>(token);
    if (!response.ok) return [];

    const rawItems = Array.isArray(data)
      ? data
      : (data && typeof data === "object" && Array.isArray((data as { data?: unknown[] }).data))
        ? ((data as { data: unknown[] }).data)
        : [];
    if (rawItems.length === 0) return [];

    const normalized = rawItems
      .map(normalizeApiNotification)
      .filter((item): item is TeacherNotification => item !== null);
    return sortByCreatedAtDesc(normalized);
  } catch {
    return [];
  }
}

async function fetchClassroomSubmissionCount(
  token: string,
  classrooms: ClassroomSummary[],
): Promise<number> {
  const classroomIds = classrooms.slice(0, 3).map((item) => item.id);
  if (classroomIds.length === 0) return 0;

  try {
    const details = await Promise.all(
      classroomIds.map(async (classId) => {
        const { response, data } = await apiGetClassroom<ClassroomDetails>(token, classId);
        if (!response.ok) return null;
        return data;
      }),
    );

    return details.reduce((sum, detail) => {
      if (!detail?.assignments) return sum;
      const submittedFromClass = detail.assignments.reduce((acc, assignment) => {
        const submitted = readNumber(assignment.status_counts?.submitted) ?? 0;
        return acc + submitted;
      }, 0);
      return sum + submittedFromClass;
    }, 0);
  } catch {
    return 0;
  }
}

function buildFallbackNotifications(input: {
  quizzes: QuizSummary[];
  classrooms: ClassroomSummary[];
  submittedCount: number;
  session: TeacherProfile | null;
}): TeacherNotification[] {
  const { quizzes, classrooms, submittedCount, session } = input;
  const now = new Date();
  const notifications: TeacherNotification[] = [];
  const hasClassrooms = classrooms.length > 0;

  const latestQuiz = [...quizzes]
    .filter((quiz) => typeof quiz.created_at === "string")
    .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())[0];

  if (latestQuiz?.created_at) {
    notifications.push(
      makeNotification({
        id: `quiz-generated-${latestQuiz.id}`,
        title: "Quiz generated successfully",
        message: `Latest quiz ready: "${latestQuiz.title ?? "Untitled Quiz"}".`,
        category: "ai_activity",
        eventType: "quiz_generated",
        severity: "success",
        createdAt: latestQuiz.created_at,
      }),
    );
  }

  const limit = session?.quizGenerationLimit;
  const used = session?.quizzesUsed;
  if (typeof limit === "number" && typeof used === "number") {
    const remaining = Math.max(0, limit - used);
    if (remaining <= 1) {
      notifications.push(
        makeNotification({
          id: "plan-limit-warning",
          title: remaining === 0 ? "Quiz generation limit reached" : "You have 1 quiz generation left",
          message:
            remaining === 0
              ? "Upgrade your plan to continue generating quizzes."
              : "Upgrade your plan to avoid generation interruptions.",
          category: "plan",
          eventType: remaining === 0 ? "limits_reached" : "plan_updates",
          severity: remaining === 0 ? "critical" : "warning",
          createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
        }),
      );
    }
  }

  const planTier = (session?.planTier ?? "trial").toLowerCase();
  if (planTier === "trial" || planTier === "basic") {
    notifications.push(
      makeNotification({
        id: "upgrade-suggestion",
        title: "Upgrade suggestion",
        message: "Pro and School plans unlock richer classroom and analytics features.",
        category: "engagement",
        eventType: "suggestions",
        severity: "info",
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      }),
    );
  }

  if (hasClassrooms) {
    const totalStudents = classrooms.reduce((sum, classroom) => sum + (readNumber(classroom.students_count) ?? 0), 0);
    if (totalStudents > 0) {
      notifications.push(
        makeNotification({
          id: "classroom-students",
          title: `${totalStudents} students in your classrooms`,
          message: "Classroom activity is live and ready to review.",
          category: "classroom",
          eventType: "student_joined",
          severity: "info",
          createdAt: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
        }),
      );
    }

    if (submittedCount > 0) {
      notifications.push(
        makeNotification({
          id: "classroom-submissions",
          title: "New student submissions",
          message: `${submittedCount} submission${submittedCount === 1 ? "" : "s"} detected in recent classroom assignments.`,
          category: "classroom",
          eventType: "quiz_submitted",
          severity: "info",
          createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        }),
      );
    }
  }

  notifications.push(
    makeNotification({
      id: "weekly-summary",
      title: "Weekly summary available",
      message: `You have ${quizzes.length} quiz${quizzes.length === 1 ? "" : "zes"} and ${classrooms.length} classroom${classrooms.length === 1 ? "" : "s"} this week.`,
      category: "engagement",
      eventType: "weekly_summary",
      severity: "success",
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    }),
  );

  return sortByCreatedAtDesc(notifications);
}

export async function fetchTeacherNotifications(params: {
  token: string;
  session: TeacherProfile | null;
}): Promise<TeacherNotification[]> {
  const { token, session } = params;
  const [classroomsResult, canonical] = await Promise.all([
    apiGetClassrooms<ClassroomSummary[]>(token),
    tryFetchCanonicalNotifications(token),
  ]);
  const classrooms = classroomsResult.response.ok && Array.isArray(classroomsResult.data) ? classroomsResult.data : [];
  const hasClassrooms = classrooms.length > 0;

  if (canonical.length > 0) {
    return hasClassrooms ? canonical : canonical.filter((item) => item.category !== "classroom");
  }

  const { response: quizzesResponse, data: quizzesData } = await apiGetQuizzes<QuizSummary[]>(token);
  const quizzes = quizzesResponse.ok && Array.isArray(quizzesData) ? quizzesData : [];

  const submittedCount = await fetchClassroomSubmissionCount(token, classrooms);
  return buildFallbackNotifications({
    quizzes,
    classrooms,
    submittedCount,
    session,
  });
}
