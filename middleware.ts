import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === "true";
  const url = req.nextUrl.clone();

  // 🚧 Maintenance mode redirect
  if (isMaintenance && !req.nextUrl.pathname.startsWith("/maintenance")) {
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  const sessionCookie = req.cookies.get("session")?.value;
  const pathname = req.nextUrl.pathname;

  const isProtectedRoute = pathname.startsWith("/user") || pathname.startsWith("/admin");
  const isAuthRoute = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"].some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to sign-in if accessing a protected route without a session cookie
  if (isProtectedRoute && !sessionCookie) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup routes to home
  if (isAuthRoute && sessionCookie) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
