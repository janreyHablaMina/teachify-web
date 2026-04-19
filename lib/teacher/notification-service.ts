import { apiGetNotifications } from "@/lib/api/client";
import type {
  NotificationCategory,
  NotificationEventType,
  NotificationSeverity,
  TeacherNotification,
} from "@/components/teacher/notifications/notification-meta";

type JsonObject = Record<string, unknown>;

function toObject(value: unknown): JsonObject {
  return value && typeof value === "object" ? (value as JsonObject) : {};
}

function readString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
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
    return [...normalized].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function fetchTeacherNotifications(params: {
  token: string;
}): Promise<TeacherNotification[]> {
  const { token } = params;
  return tryFetchCanonicalNotifications(token);
}
