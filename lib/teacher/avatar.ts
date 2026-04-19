import { API_BASE_URL } from "@/lib/api/client";
import type { TeacherProfile } from "@/lib/auth/profile";

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function encodePath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function toAbsoluteUrl(path: string): string {
  const normalized = normalizePath(path);

  if (/^https?:\/\//i.test(API_BASE_URL)) {
    return `${API_BASE_URL.replace(/\/$/, "")}${normalized}`;
  }

  return `${API_BASE_URL}${normalized}`;
}

export function resolveTeacherAvatarUrl(profile: TeacherProfile | null | undefined): string | undefined {
  const directUrl = profile?.profilePhotoUrl?.trim();
  if (directUrl) return directUrl;

  const path = profile?.profilePhotoPath?.trim();
  if (!path) return undefined;

  if (/^https?:\/\//i.test(path)) return path;

  if (path.startsWith("/backend/")) return path;
  if (path.startsWith("/api/")) return toAbsoluteUrl(path);

  const normalizedPath = path.replace(/^\/+/, "");
  const encodedPath = encodePath(normalizedPath);

  // Prefer API-served media for Docker/local setups where /storage symlink is not publicly served.
  if (path.startsWith("/storage/")) {
    const storageRelativePath = path.replace(/^\/storage\/+/, "");
    return toAbsoluteUrl(`/api/media/${encodePath(storageRelativePath)}`);
  }

  return toAbsoluteUrl(`/api/media/${encodedPath}`);
}
