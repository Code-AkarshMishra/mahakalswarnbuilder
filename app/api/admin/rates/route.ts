import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/token";
import { saveRatesConfig, resetRatesConfig, getRatesConfig } from "@/lib/ratesStore";

export const dynamic = "force-dynamic";

export async function GET() {
    // Protected check
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const isValid = await verifySessionToken(token);

    if (!isValid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rates = await getRatesConfig();
    return NextResponse.json(rates);
}

export async function PUT(request: Request) {
    // Protected check
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const isValid = await verifySessionToken(token);

    if (!isValid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        let username = "Admin";
        if (token) {
            const [base64] = token.split(".");
            try {
                const payload = JSON.parse(atob(base64));
                if (payload.username) username = payload.username;
            } catch {
                // Ignore
            }
        }

        const body = await request.json();

        // Check if user requested a reset
        if (body.action === "reset") {
            const resetRates = await resetRatesConfig(`${username} (Reset Defaults)`);
            return NextResponse.json({
                success: true,
                message: "Rates reset to reference defaults successfully",
                rates: resetRates
            });
        }

        // Validation
        const { basicRatePerSqFt, moderateRatePerSqFt, advanceRatePerSqFt, materials, timeline } = body;

        if (basicRatePerSqFt && (isNaN(Number(basicRatePerSqFt)) || Number(basicRatePerSqFt) <= 0)) {
            return NextResponse.json({ error: "Invalid Basic Rate" }, { status: 400 });
        }
        if (moderateRatePerSqFt && (isNaN(Number(moderateRatePerSqFt)) || Number(moderateRatePerSqFt) <= 0)) {
            return NextResponse.json({ error: "Invalid Moderate Rate" }, { status: 400 });
        }
        if (advanceRatePerSqFt && (isNaN(Number(advanceRatePerSqFt)) || Number(advanceRatePerSqFt) <= 0)) {
            return NextResponse.json({ error: "Invalid Advance Rate" }, { status: 400 });
        }

        const updated = await saveRatesConfig(
            {
                basicRatePerSqFt: basicRatePerSqFt ? Number(basicRatePerSqFt) : undefined,
                moderateRatePerSqFt: moderateRatePerSqFt ? Number(moderateRatePerSqFt) : undefined,
                advanceRatePerSqFt: advanceRatePerSqFt ? Number(advanceRatePerSqFt) : undefined,
                materials: Array.isArray(materials) ? materials : undefined,
                timeline: Array.isArray(timeline) ? timeline : undefined
            },
            username
        );

        return NextResponse.json({
            success: true,
            message: "Rates updated and saved successfully",
            rates: updated
        });
    } catch (error) {
        console.error("PUT /api/admin/rates error:", error);
        return NextResponse.json(
            { error: "Failed to update rates on server" },
            { status: 500 }
        );
    }
}
