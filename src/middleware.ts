import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/settings"];

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value;
  const { pathname } = request.nextUrl;

  // Check if accessing protected route without session
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if logged in and accessing login or landing page
  if ((pathname === "/login" || pathname === "/") && sessionId) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/login", "/"],
};
