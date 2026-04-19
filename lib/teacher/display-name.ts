import type { TeacherProfile } from "@/lib/auth/profile";

function clean(value?: string): string {
  return typeof value === "string" ? value.trim() : "";
}

export function getTeacherDisplayName(profile: TeacherProfile | null | undefined): string {
  const displayName = clean(profile?.displayName);
  if (displayName) return displayName;

  const fullName = clean(profile?.name);
  if (fullName && fullName.toLowerCase() !== "educator") return fullName;

  const email = clean(profile?.email);
  if (email) {
    const localPart = email.split("@")[0]?.trim();
    if (localPart) return localPart;
  }

  return "Educator";
}

