import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(['/user(.*)', '/admin(.*)'])
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/forgot-password(.*)', '/reset-password(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === "true"
  const url = req.nextUrl.clone()

  // 🚧 Maintenance mode redirect
  if (isMaintenance && !req.nextUrl.pathname.startsWith("/maintenance")) {
    url.pathname = "/maintenance"
    return NextResponse.redirect(url)
  }

  const { userId } = await auth()

  if (isAuthRoute(req) && userId) {
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
}
