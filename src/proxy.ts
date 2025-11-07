import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const proxy = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;

  // Protect /admin and /dashboard routes
  if (path.startsWith("/admin") || path.startsWith("/dashboard")) {
    // Quick optimistic check for session existence (no DB call)
    // NOTE: This only checks if a session cookie exists, NOT if it's valid
    // Actual session validation happens in each dashboard page/route
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
};

// Configure which routes proxy runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth/* (Better Auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (static files)
     * - files with extensions (.*\..*)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};

export default proxy;
