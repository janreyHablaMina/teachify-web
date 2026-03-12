import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "teachify_auth";
const ROLE_COOKIE = "teachify_role";

// Paths that don't require authentication
const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password"];
const AUTH_REDIRECT_PATHS = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Get auth state
  const isAuthed = request.cookies.get(AUTH_COOKIE)?.value === "1";
  const userRole = request.cookies.get(ROLE_COOKIE)?.value;
  const hasValidRole = userRole === "admin" || userRole === "teacher";
  const hasValidSession = isAuthed && hasValidRole;

  // 2. Determine if the path is public or for a specific portal
  const isPublicPath = PUBLIC_PATHS.some(path => pathname === path);
  const isAdminPath = pathname.startsWith("/admin");
  const isTeacherPath = pathname.startsWith("/teacher");

  // Logic A: Redirect authed users away from auth pages to their dashboard
  if (isPublicPath && AUTH_REDIRECT_PATHS.includes(pathname) && hasValidSession) {
    return NextResponse.redirect(new URL(userRole === "admin" ? "/admin" : "/teacher", request.url));
  }

  // Logic B: Protect dashboard routes
  if ((isAdminPath || isTeacherPath) && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
    response.cookies.set(ROLE_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  }

  // Logic C: Enforce role-based access for admins (admins can't go to teacher dashboard and vice versa)
  if (isAdminPath && userRole !== "admin") {
    return NextResponse.redirect(new URL(hasValidSession ? "/teacher" : "/login", request.url));
  }

  if (isTeacherPath && userRole !== "teacher") {
    return NextResponse.redirect(new URL(hasValidSession ? "/admin" : "/login", request.url));
  }

  return NextResponse.next();
}

// Protect all routes except static assets and api
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/pngs in public
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
