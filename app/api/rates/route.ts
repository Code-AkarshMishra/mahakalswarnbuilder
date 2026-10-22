import { NextResponse } from "next/server";
import { getRatesConfig } from "@/lib/ratesStore";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const rates = await getRatesConfig();
        return NextResponse.json(rates, {
            headers: {
                "Cache-Control": "no-store"
            }
        });
    } catch (error) {
        console.error("GET /api/rates error:", error);
        return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
    }
}
