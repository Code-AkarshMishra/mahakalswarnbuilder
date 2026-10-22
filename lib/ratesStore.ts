import fs from "fs";
import path from "path";
import initialRates from "@/data/rates.json";
import { DEFAULT_RATES_CONFIG, RatesConfig } from "./rates-types";
import { ensureDatabaseSchema, getDatabaseClient } from "./database";
export { getTierMaterialRates } from "./rates-types";

const DATA_DIR = path.join(process.cwd(), "data");
const RATES_FILE = path.join(DATA_DIR, "rates.json");
const INITIAL_RATES_CONFIG = normalizeRatesConfig(initialRates) ?? DEFAULT_RATES_CONFIG;

let cachedLocalRates: RatesConfig | null = null;

function normalizeRatesConfig(value: unknown): RatesConfig | null {
    let parsed = value;

    if (typeof parsed === "string") {
        try {
            parsed = JSON.parse(parsed);
        } catch {
            return null;
        }
    }

    if (!parsed || typeof parsed !== "object") {
        return null;
    }

    const rates = parsed as Partial<RatesConfig>;
    if (
        typeof rates.basicRatePerSqFt !== "number" ||
        typeof rates.moderateRatePerSqFt !== "number" ||
        typeof rates.advanceRatePerSqFt !== "number" ||
        !Array.isArray(rates.materials) ||
        !Array.isArray(rates.timeline)
    ) {
        return null;
    }

    return {
        ...DEFAULT_RATES_CONFIG,
        ...rates,
        packageFeatures: {
            ...DEFAULT_RATES_CONFIG.packageFeatures,
            ...(rates.packageFeatures || {})
        },
        taxSettings: {
            ...DEFAULT_RATES_CONFIG.taxSettings,
            ...(rates.taxSettings || {})
        },
        companyInfo: {
            ...DEFAULT_RATES_CONFIG.companyInfo,
            ...(rates.companyInfo || {})
        }
    };
}

function ensureDataDirectory(): void {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

async function getDatabaseRates(): Promise<RatesConfig> {
    const sql = getDatabaseClient();
    if (!sql) {
        throw new Error("DATABASE_URL is not configured.");
    }

    await ensureDatabaseSchema(sql);
    let rows = await sql`SELECT value FROM site_settings WHERE setting_key = 'rates'`;

    if (rows.length === 0) {
        await sql`
            INSERT INTO site_settings (setting_key, value)
            VALUES ('rates', ${JSON.stringify(INITIAL_RATES_CONFIG)}::jsonb)
            ON CONFLICT (setting_key) DO NOTHING
        `;
        rows = await sql`SELECT value FROM site_settings WHERE setting_key = 'rates'`;
    }

    const rates = normalizeRatesConfig(rows[0]?.value);
    if (!rates) {
        throw new Error("The rates settings stored in Neon are invalid.");
    }

    return rates;
}

async function getLocalRates(): Promise<RatesConfig> {
    if (cachedLocalRates) {
        return cachedLocalRates;
    }

    try {
        ensureDataDirectory();
        if (fs.existsSync(RATES_FILE)) {
            const rates = normalizeRatesConfig(fs.readFileSync(RATES_FILE, "utf-8"));
            if (rates) {
                cachedLocalRates = rates;
                return rates;
            }
        }
    } catch (error) {
        console.error("Error reading rates.json:", error);
    }

    cachedLocalRates = INITIAL_RATES_CONFIG;
    return cachedLocalRates;
}

export async function getRatesConfig(): Promise<RatesConfig> {
    if (getDatabaseClient()) {
        return getDatabaseRates();
    }

    if (process.env.NODE_ENV === "production") {
        return INITIAL_RATES_CONFIG;
    }

    return getLocalRates();
}

export async function saveRatesConfig(
    updates: Partial<RatesConfig>,
    updatedBy: string = "Admin"
): Promise<RatesConfig> {
    if (!getDatabaseClient() && process.env.NODE_ENV === "production") {
        throw new Error("Configure DATABASE_URL in Vercel to publish admin changes.");
    }

    const current = await getRatesConfig();
    const newConfig: RatesConfig = {
        ...current,
        ...updates,
        basicRatePerSqFt: Number(updates.basicRatePerSqFt ?? current.basicRatePerSqFt),
        moderateRatePerSqFt: Number(updates.moderateRatePerSqFt ?? current.moderateRatePerSqFt),
        advanceRatePerSqFt: Number(updates.advanceRatePerSqFt ?? current.advanceRatePerSqFt),
        materials: updates.materials ? updates.materials.map((material) => ({
            resource: material.resource,
            rate: Number(material.rate)
        })) : current.materials,
        timeline: updates.timeline ?? current.timeline,
        packageFeatures: updates.packageFeatures ? {
            basic: updates.packageFeatures.basic || current.packageFeatures.basic,
            moderate: updates.packageFeatures.moderate || current.packageFeatures.moderate,
            advance: updates.packageFeatures.advance || current.packageFeatures.advance,
        } : current.packageFeatures,
        taxSettings: updates.taxSettings ? {
            ...current.taxSettings,
            ...updates.taxSettings
        } : current.taxSettings,
        companyInfo: updates.companyInfo ? {
            ...current.companyInfo,
            ...updates.companyInfo
        } : current.companyInfo,
        lastUpdated: new Date().toISOString(),
        updatedBy
    };

    const sql = getDatabaseClient();
    if (sql) {
        await ensureDatabaseSchema(sql);
        await sql`
            INSERT INTO site_settings (setting_key, value, updated_at)
            VALUES ('rates', ${JSON.stringify(newConfig)}::jsonb, NOW())
            ON CONFLICT (setting_key)
            DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
        `;
        return newConfig;
    }

    ensureDataDirectory();
    const tempFile = `${RATES_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(newConfig, null, 2), "utf-8");
    fs.renameSync(tempFile, RATES_FILE);
    cachedLocalRates = newConfig;
    return newConfig;
}

export async function resetRatesConfig(updatedBy: string = "Admin (Reset)"): Promise<RatesConfig> {
    return saveRatesConfig(DEFAULT_RATES_CONFIG, updatedBy);
}
