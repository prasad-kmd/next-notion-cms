import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";

interface Session {
	user: {
		id: string;
		name: string;
		email: string;
		image?: string;
		role?: string;
	};
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
		token: string;
		createdAt: Date;
		updatedAt: Date;
		ipAddress?: string;
		userAgent?: string;
	};
}

// Configurable protected routes
const PROTECTED_ROUTES = [
	{ path: "/roadmap", exact: true, role: "admin" },
	{ path: "/admin", pattern: "/admin/*", role: "admin" },
];

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if the current path is protected
	const protectedRoute = PROTECTED_ROUTES.find(route => {
		if (route.exact) {
			return pathname === route.path;
		}
		if (route.pattern) {
			const pattern = route.pattern.replace(/\*/g, ".*");
			const regex = new RegExp(`^${pattern}$`);
			return regex.test(pathname);
		}
		return false;
	});

	// If it's a dashboard route or a protected route, we need a session
	const isDashboard = pathname.startsWith("/dashboard");
	
	if (isDashboard || protectedRoute) {
		const { data: session } = await betterFetch<Session>(
			"/api/auth/get-session",
			{
				baseURL: request.nextUrl.origin,
				headers: {
					cookie: request.headers.get("cookie") || "",
				},
			},
		);

		if (!session) {
			const signInUrl = new URL("/sign-in", request.url);
			signInUrl.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(signInUrl);
		}

		// Authorization check for admin routes
		if (protectedRoute && protectedRoute.role === "admin") {
			if (session.user.role !== "admin") {
				return NextResponse.redirect(new URL("/not-authorized", request.url));
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/roadmap",
		"/admin/:path*",
	],
};
