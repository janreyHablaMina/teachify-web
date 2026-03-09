import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "teachify_auth";
const ROLE_COOKIE = "teachify_role";

const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/teacher");

  const isAuthed = request.cookies.get(AUTH_COOKIE)?.value === "1";
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  if (isPublic && isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = role === "admin" ? "/admin" : "/teacher";
    return NextResponse.redirect(url);
  }

  if (isProtected && !isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = isAuthed ? "/teacher" : "/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/teacher") && role !== "teacher") {
    const url = request.nextUrl.clone();
    url.pathname = isAuthed ? "/admin" : "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/forgot-password", "/admin/:path*", "/teacher/:path*"],
};
