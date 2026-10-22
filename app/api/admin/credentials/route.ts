import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/token";
import { updateStoredAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const isValid = await verifySessionToken(token);

    if (!isValid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body: unknown = await request.json();
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const { currentPassword, newPassword, newUsername } = body as {
            currentPassword?: unknown;
            newPassword?: unknown;
            newUsername?: unknown;
        };

        if (typeof currentPassword !== "string" || !currentPassword) {
            return NextResponse.json(
                { error: "Current password is required to verify identity" },
                { status: 400 }
            );
        }

        if (typeof newPassword !== "string" || newPassword.length < 8) {
            return NextResponse.json(
                { error: "New password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        let currentUsername = "admin";
        if (token) {
            const [base64Payload] = token.split(".");
            currentUsername = JSON.parse(atob(base64Payload)).username || currentUsername;
        }
        const result = await updateStoredAdminCredentials(
            currentUsername,
            currentPassword,
            newPassword,
            typeof newUsername === "string" ? newUsername : undefined
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Failed to update credentials" },
                { status: result.error?.startsWith("Configure DATABASE_URL") ? 503 : 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Admin credentials securely updated and hashed."
        });
    } catch (error) {
        console.error("POST /api/admin/credentials error:", error);
        return NextResponse.json(
            { error: "Failed to update admin credentials" },
            { status: 500 }
        );
    }
}
