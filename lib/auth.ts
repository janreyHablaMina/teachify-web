export type UserRole = "admin" | "teacher";

const AUTH_COOKIE = "teachify_auth";
const ROLE_COOKIE = "teachify_role";
const MAX_AGE_SECONDS = 60 * 60 * 8;

export function signIn(role: UserRole) {
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}

export function signOut() {
  document.cookie = `${AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${ROLE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
