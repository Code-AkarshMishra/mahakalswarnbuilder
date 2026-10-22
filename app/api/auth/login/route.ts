import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminCredentials, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }
        const { username, password } = body as { username?: unknown; password?: unknown };

        if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password.trim()) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        const isValid = await verifyAdminCredentials(username.trim(), password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        const token = await createSessionToken(username.trim());

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return NextResponse.json({
            success: true,
            message: "Authentication successful",
            user: { username: username.trim(), role: "owner" }
        });
    } catch (error) {
        console.error("POST /api/auth/login error:", error);
        return NextResponse.json(
            { error: "Internal server error during login" },
            { status: 500 }
        );
    }
}
