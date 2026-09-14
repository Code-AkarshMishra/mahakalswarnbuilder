import fs from "fs";
import path from "path";
import crypto from "crypto";
export { COOKIE_NAME, createSessionToken, verifySessionToken } from "./token";

const DATA_DIR = path.join(process.cwd(), "data");
const CRED_FILE = path.join(DATA_DIR, "admin-credentials.json");

export interface StoredCredentials {
    username: string;
    passwordHash: string; // Format: "salt:derivedHash"
    updatedAt: string;
}

/**
 * Cryptographic Password Hasher using PBKDF2-SHA512
 * 100,000 iterations + 16-byte random salt
 */
export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return `${salt}:${derivedKey}`;
}

/**
 * Constant-time password verification to prevent timing attacks
 */
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

function ensureDataDirectory(): void {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

/**
 * Live disk-based env reader:
 * Directly parses .env.local, .env, and handles any typos so changes in env take effect IMMEDIATELY
 * without needing a server restart!
 */
function readLiveEnvFile(): { username?: string; password?: string; passwordHash?: string } {
    const candidates = [
        path.join(process.cwd(), ".env.local"),
        path.join(process.cwd(), ".env"),
        path.join(process.cwd(), ".env.localll")
    ];

    let username: string | undefined = process.env.ADMIN_USERNAME;
    let password: string | undefined = process.env.ADMIN_PASSWORD;
    let passwordHash: string | undefined = process.env.ADMIN_PASSWORD_HASH;

    for (const file of candidates) {
        if (fs.existsSync(file)) {
            try {
                const content = fs.readFileSync(file, "utf-8");
                const lines = content.split("\n");
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith("#")) continue;
                    const idx = trimmed.indexOf("=");
                    if (idx > 0) {
                        const key = trimmed.slice(0, idx).trim();
                        let val = trimmed.slice(idx + 1).trim();
                        // Remove enclosing quotes if any
                        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                            val = val.slice(1, -1);
                        }
                        if (key === "ADMIN_USERNAME") username = val;
                        if (key === "ADMIN_PASSWORD") password = val;
                        if (key === "ADMIN_PASSWORD_HASH") passwordHash = val;
                    }
                }
            } catch {
                // Ignore read errors
            }
        }
    }

    return { username, password, passwordHash };
}

/**
 * Retrieves the stored credentials or synchronizes with live environment file.
 */
export function getStoredCredentials(): StoredCredentials {
    ensureDataDirectory();

    const liveEnv = readLiveEnvFile();

    // 1. Check persistent file storage
    if (fs.existsSync(CRED_FILE)) {
        try {
            const raw = fs.readFileSync(CRED_FILE, "utf-8");
            const data = JSON.parse(raw);

            if (data.username && data.passwordHash) {
                return data as StoredCredentials;
            }
        } catch (e) {
            console.error("Error reading credentials file:", e);
        }
    }

    // 2. If liveEnv or process.env has a password, hash and save it
    const envUser = liveEnv.username || process.env.ADMIN_USERNAME || "admin";
    const envPass = liveEnv.password || process.env.ADMIN_PASSWORD || crypto.randomBytes(16).toString("hex");
    const initialHash = liveEnv.passwordHash || process.env.ADMIN_PASSWORD_HASH || hashPassword(envPass);

    const initialCreds: StoredCredentials = {
        username: envUser,
        passwordHash: initialHash,
        updatedAt: new Date().toISOString()
    };

    try {
        fs.writeFileSync(CRED_FILE, JSON.stringify(initialCreds, null, 2), "utf-8");
    } catch (writeErr) {
        console.error("Failed to write initial credentials:", writeErr);
    }

    return initialCreds;
}

/**
 * Verify admin login against:
 * 1. Live .env / .env.local file password (immediate dynamic check, auto-updates hash on match)
 * 2. Stored salted hash in data/admin-credentials.json
 */
export function verifyAdminCredentials(user: string, pass: string): boolean {
    if (!user || !pass) return false;

    const trimmedUser = user.trim();
    const trimmedPass = pass.trim();

    // 1. DIRECT CHECK AGAINST LIVE .env / .env.local FILE
    const liveEnv = readLiveEnvFile();
    const expectedUser = (liveEnv.username || "admin").trim();

    if (trimmedUser.toLowerCase() === expectedUser.toLowerCase()) {
        // Direct match against env password
        if (liveEnv.password && trimmedPass === liveEnv.password.trim()) {
            // Re-hash and update stored hash immediately so both stay in sync!
            ensureDataDirectory();
            const newHash = hashPassword(trimmedPass);
            fs.writeFileSync(CRED_FILE, JSON.stringify({
                username: expectedUser,
                passwordHash: newHash,
                updatedAt: new Date().toISOString()
            }, null, 2), "utf-8");
            return true;
        }

        // Direct match against env password hash
        if (liveEnv.passwordHash && verifyPassword(trimmedPass, liveEnv.passwordHash)) {
            return true;
        }
    }

    // 2. CHECK AGAINST STORED HASH ON DISK
    const creds = getStoredCredentials();
    if (trimmedUser.toLowerCase() === creds.username.toLowerCase()) {
        if (verifyPassword(trimmedPass, creds.passwordHash)) {
            return true;
        }
    }

    return false;
}

/**
 * Updates admin credentials with required old password verification
 */
export function updateStoredAdminCredentials(
    currentPassword: string,
    newPassword: string,
    newUsername?: string
): { success: boolean; error?: string } {
    ensureDataDirectory();

    const isCurrentValid = verifyAdminCredentials(newUsername || "admin", currentPassword);
    if (!isCurrentValid) {
        return { success: false, error: "Incorrect current password." };
    }

    if (!newPassword || newPassword.length < 8) {
        return { success: false, error: "New password must be at least 8 characters long." };
    }

    const newHash = hashPassword(newPassword.trim());
    const finalUsername = (newUsername && newUsername.trim()) || "admin";

    const toSave: StoredCredentials = {
        username: finalUsername,
        passwordHash: newHash,
        updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(CRED_FILE, JSON.stringify(toSave, null, 2), "utf-8");

    // Also update .env and .env.local if present so env stays in sync
    const envPath = path.join(process.cwd(), ".env.local");
    try {
        fs.writeFileSync(
            envPath,
            `ADMIN_USERNAME=${finalUsername}\nADMIN_PASSWORD=${newPassword.trim()}\nADMIN_SESSION_SECRET=mahakal_swarn_builder_session_secret_key_2026_super_secure\n`,
            "utf-8"
        );
    } catch {
        // Ignore
    }

    return { success: true };
}
