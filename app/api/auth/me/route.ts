import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/token";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const isValid = await verifySessionToken(token);

    if (!isValid) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        const [base64Payload] = (token || "").split(".");
        const payload = JSON.parse(atob(base64Payload));
        return NextResponse.json({
            authenticated: true,
            user: { username: payload.username, role: payload.role }
        });
    } catch {
        return NextResponse.json({ authenticated: true, user: { role: "owner" } });
    }
}
