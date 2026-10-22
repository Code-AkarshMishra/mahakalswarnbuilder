import fs from "fs";
import path from "path";
import crypto from "crypto";
import { ensureDatabaseSchema, getDatabaseClient } from "./database";
export { COOKIE_NAME, createSessionToken, verifySessionToken } from "./token";

const DATA_DIR = path.join(process.cwd(), "data");
const CRED_FILE = path.join(DATA_DIR, "admin-credentials.json");

export interface StoredCredentials {
    username: string;
    passwordHash: string;
    updatedAt: string;
}

export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
    try {
        if (!combinedHash || !combinedHash.includes(":")) return false;
        const [salt, originalHash] = combinedHash.split(":");
        if (!salt || !originalHash) return false;

        const testKey = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
        const originalKey = Buffer.from(originalHash, "hex");

        if (testKey.length !== originalKey.length) return false;
        return crypto.timingSafeEqual(testKey, originalKey);
    } catch {
        return false;
    }
}

function getEnvironmentCredentials(): { username: string; password?: string; passwordHash?: string } | null {
    const username = process.env.ADMIN_USERNAME?.trim() || "admin";
    const password = process.env.ADMIN_PASSWORD;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!password && !passwordHash) {
        return null;
    }

    return { username, password, passwordHash };
}

function getLocalCredentials(): StoredCredentials | null {
    if (process.env.NODE_ENV === "production" || !fs.existsSync(CRED_FILE)) {
        return null;
    }

    try {
        const credentials = JSON.parse(fs.readFileSync(CRED_FILE, "utf-8")) as StoredCredentials;
        return credentials.username && credentials.passwordHash ? credentials : null;
    } catch (error) {
        console.error("Error reading local admin credentials:", error);
        return null;
    }
}

function matchesPassword(
    submittedPassword: string,
    credentials: { password?: string; passwordHash?: string }
): boolean {
    if (credentials.password && submittedPassword === credentials.password.trim()) {
        return true;
    }
    return Boolean(credentials.passwordHash && verifyPassword(submittedPassword, credentials.passwordHash));
}

export async function verifyAdminCredentials(user: string, pass: string): Promise<boolean> {
    if (!user || !pass) return false;

    const submittedUser = user.trim().toLowerCase();
    const submittedPassword = pass.trim();
    const sql = getDatabaseClient();

    if (sql) {
        await ensureDatabaseSchema(sql);
        const rows = await sql`
            SELECT username, password_hash AS "passwordHash"
            FROM admin_credentials
            WHERE id = TRUE
        `;
        const stored = rows[0] as { username: string; passwordHash: string } | undefined;

        if (stored) {
            return submittedUser === stored.username.trim().toLowerCase() &&
                verifyPassword(submittedPassword, stored.passwordHash);
        }
    }

    const environmentCredentials = getEnvironmentCredentials();
    if (
        environmentCredentials &&
        submittedUser === environmentCredentials.username.toLowerCase() &&
        matchesPassword(submittedPassword, environmentCredentials)
    ) {
        return true;
    }

    const localCredentials = getLocalCredentials();
    return Boolean(
        localCredentials &&
        submittedUser === localCredentials.username.trim().toLowerCase() &&
        verifyPassword(submittedPassword, localCredentials.passwordHash)
    );
}

export async function updateStoredAdminCredentials(
    currentUsername: string,
    currentPassword: string,
    newPassword: string,
    newUsername?: string
): Promise<{ success: boolean; error?: string }> {
    if (!newPassword || newPassword.trim().length < 8) {
        return { success: false, error: "New password must be at least 8 characters long." };
    }

    const sql = getDatabaseClient();
    if (!sql && process.env.NODE_ENV === "production") {
        return {
            success: false,
            error: "Configure DATABASE_URL in Vercel before changing admin credentials."
        };
    }

    const isCurrentValid = await verifyAdminCredentials(currentUsername, currentPassword);
    if (!isCurrentValid) {
        return { success: false, error: "Incorrect current password." };
    }

    const finalUsername = newUsername?.trim() || currentUsername.trim();
    const newHash = hashPassword(newPassword.trim());

    if (sql) {
        await ensureDatabaseSchema(sql);
        await sql`
            INSERT INTO admin_credentials (id, username, password_hash, updated_at)
            VALUES (TRUE, ${finalUsername}, ${newHash}, NOW())
            ON CONFLICT (id)
            DO UPDATE SET
                username = EXCLUDED.username,
                password_hash = EXCLUDED.password_hash,
                updated_at = NOW()
        `;
    } else {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(
            CRED_FILE,
            JSON.stringify({
                username: finalUsername,
                passwordHash: newHash,
                updatedAt: new Date().toISOString()
            }, null, 2),
            "utf-8"
        );
    }

    return { success: true };
}
