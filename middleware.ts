import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "teachify_auth";
const ROLE_COOKIE = "teachify_role";

// Paths that don't require authentication
const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname;

  // In local development, force a single loopback host so Sanctum cookies
  // are issued and sent on a consistent domain.
  if (
    process.env.NODE_ENV === "development" &&
    hostname === "localhost"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "127.0.0.1";
    return NextResponse.redirect(redirectUrl);
  }

  // 1. Get auth state
  const isAuthed = request.cookies.get(AUTH_COOKIE)?.value === "1";
  const userRole = request.cookies.get(ROLE_COOKIE)?.value;

  // 2. Determine if the path is public or for a specific portal
  const isPublicPath = PUBLIC_PATHS.some(path => pathname === path);
  const isAdminPath = pathname.startsWith("/admin");
  const isTeacherPath = pathname.startsWith("/teacher");

  // Logic A: Redirect authed users away from login/landing to their dashboard
  if (isPublicPath && isAuthed) {
    return NextResponse.redirect(new URL(userRole === "admin" ? "/admin" : "/teacher", request.url));
  }

  // Logic B: Protect dashboard routes
  if ((isAdminPath || isTeacherPath) && !isAuthed) {
    const loginUrl = new URL("/login", request.url);
    // Optional: add a redirect back parameter
    // loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logic C: Enforce role-based access for admins (admins can't go to teacher dashboard and vice versa)
  if (isAdminPath && userRole !== "admin") {
    return NextResponse.redirect(new URL("/teacher", request.url));
  }

  if (isTeacherPath && userRole !== "teacher") {
    return NextResponse.redirect(new URL("/admin", request.url));
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
