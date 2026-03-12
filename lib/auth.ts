import api from "./axios";

export type UserRole = "admin" | "teacher";
type SignInCredentials = {
  email: string;
  password: string;
};

const AUTH_COOKIE = "teachify_auth";
const ROLE_COOKIE = "teachify_role";
const MAX_AGE_SECONDS = 60 * 60 * 8;

/**
 * Get the CSRF cookie from Laravel
 */
export async function getCsrfCookie() {
  await api.get("/sanctum/csrf-cookie");
}

/**
 * Sign in the user via Laravel Sanctum
 */
export async function signIn(credentials: SignInCredentials) {
  await getCsrfCookie();
  const response = await api.post("/api/login", credentials);
  const user = response.data.user;

  // Set shadow cookies for middleware
  setShadowCookies(user.role);

  return response.data;
}

/**
 * Sign out the user
 */
export async function signOut() {
  try {
    await api.post("/api/logout");
  } finally {
    // Clear shadow cookies
    document.cookie = `${AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${ROLE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

/**
 * Set shadow cookies for the Edge Middleware to handle redirection
 */
export function setShadowCookies(role: UserRole) {
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}

/**
 * Get the current authenticated user from the API
 */
export async function getUser() {
  try {
    const response = await api.get("/api/user");
    return response.data.user;
  } catch {
    return null;
  }
}
