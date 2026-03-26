export type DeadlineStatus = "overdue" | "due_soon" | "upcoming" | "none";

export function parseDeadline(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function formatDeadline(value?: string | null): string {
  const date = parseDeadline(value);
  if (!date) return "No deadline";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getDeadlineStatus(value?: string | null): DeadlineStatus {
  const deadline = parseDeadline(value);
  if (!deadline) return "none";
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  if (diffMs < 0) return "overdue";
  if (diffMs <= 1000 * 60 * 60 * 24 * 2) return "due_soon";
  return "upcoming";
}
