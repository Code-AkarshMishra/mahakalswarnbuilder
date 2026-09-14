import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "./lib/token";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow login page and public auth endpoints
    if (pathname === "/admin/login" || pathname.startsWith("/api/auth/")) {
        return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isValid = await verifySessionToken(token);

    if (!isValid) {
        // For API routes, return 401 JSON
        if (pathname.startsWith("/api/admin")) {
            return NextResponse.json(
                { error: "Unauthorized. Admin credentials required." },
                { status: 401 }
            );
        }

        // For web pages, redirect to login with return URL
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*"
    ]
};
