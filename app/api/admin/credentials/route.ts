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
        const body = await request.json();
        const { currentPassword, newPassword, newUsername } = body;

        if (!currentPassword) {
            return NextResponse.json(
                { error: "Current password is required to verify identity" },
                { status: 400 }
            );
        }

        if (!newPassword || newPassword.length < 8) {
            return NextResponse.json(
                { error: "New password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        const result = updateStoredAdminCredentials(currentPassword, newPassword, newUsername);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Failed to update credentials" },
                { status: 400 }
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
