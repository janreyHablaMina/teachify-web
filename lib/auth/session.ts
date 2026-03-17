export const TOKEN_STORAGE_KEY = "teachify_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function storeToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getRouteForRole(role: string): string {
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teacher";
  return "/";
}
