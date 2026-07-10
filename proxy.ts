import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(['/user(.*)', '/admin(.*)', '/dashboard(.*)', '/interview(.*)', '/onboarding(.*)'])
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/forgot-password(.*)', '/reset-password(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === "true"
  const url = req.nextUrl.clone()

  // 🚧 Maintenance mode redirect
  if (isMaintenance && !req.nextUrl.pathname.startsWith("/maintenance")) {
    url.pathname = "/maintenance"
    return NextResponse.redirect(url)
  }

  const host = req.headers.get("host") || "";

  // 📖 Bypass Clerk auth for documentation subdomain
  if (host === "docs.mockrithm.me" || host.includes("docs.mockrithm.me")) {
    return NextResponse.next();
  }

  // 🎮 Bypass and forward games subdomain requests (handled by vercel.json rewrites)
  if (host === "games.mockrithm.me" || host.includes("games.mockrithm.me")) {
    return NextResponse.next();
  }

  // 📝 Bypass Clerk auth for resume subdomain requests (handled by vercel.json rewrites)
  if (host === "resume.mockrithm.me" || host.includes("resume.mockrithm.me")) {
    return NextResponse.next();
  }

  // 🔐 Redirect auth routes on apex domain to the accounts subdomain
  if (isAuthRoute(req) && (host === "mockrithm.me" || host === "www.mockrithm.me")) {
    const redirectUrl = `https://accounts.mockrithm.me${req.nextUrl.pathname}${req.nextUrl.search}`;
    return NextResponse.redirect(redirectUrl);
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
