export const COOKIE_NAME = "msb_admin_session";
const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || "mahakal-swarn-builder-secret-key-2026-secure";

/**
 * Web Crypto HMAC-SHA256 Token Signer
 * Safe for Edge runtime (proxy.ts), Browser, and Node.js runtimes
 */
async function getCryptoKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    return await crypto.subtle.importKey(
        "raw",
        encoder.encode(SECRET_KEY),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    );
}

function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function createSessionToken(username: string): Promise<string> {
    const payload = {
        username,
        role: "owner",
        issuedAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    const payloadStr = JSON.stringify(payload);
    const encoder = new TextEncoder();
    const key = await getCryptoKey();
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadStr));
    const sigHex = bufferToHex(signature);
    
    const base64Payload = btoa(payloadStr);
    return `${base64Payload}.${sigHex}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
    if (!token || !token.includes(".")) return false;

    try {
        const [base64Payload, sigHex] = token.split(".");
        if (!base64Payload || !sigHex) return false;

        const payloadStr = atob(base64Payload);
        const payload = JSON.parse(payloadStr);

        if (!payload.expiresAt || payload.expiresAt < Date.now()) {
            return false;
        }

        const key = await getCryptoKey();
        const encoder = new TextEncoder();
        const actualSig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadStr));
        const actualSigHex = bufferToHex(actualSig);

        return sigHex === actualSigHex;
    } catch {
        return false;
    }
}
