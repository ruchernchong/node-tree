import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export const proxy = async (request: NextRequest) => {
	const path = request.nextUrl.pathname;

	// Get session from Better Auth
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	// Protect /admin routes
	if (path.startsWith("/admin")) {
		// Check if user is authenticated
		if (!session?.user) {
			return NextResponse.redirect(new URL("/", request.url));
		}

		// Phase 1: Check if user is the admin
		const adminUserId = process.env.ADMIN_USER_ID;
		if (!adminUserId) {
			console.error("ADMIN_USER_ID not configured");
			return NextResponse.redirect(new URL("/", request.url));
		}

		if (session.user.id !== adminUserId) {
			console.warn(
				`Unauthorized admin access attempt by user: ${session.user.id}`,
			);
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
