import fs from "fs";
import path from "path";
import { DEFAULT_RATES_CONFIG, RatesConfig } from "./rates-types";
export { getTierMaterialRates } from "./rates-types";

const DATA_DIR = path.join(process.cwd(), "data");
const RATES_FILE = path.join(DATA_DIR, "rates.json");

let cachedRates: RatesConfig | null = null;

function ensureDataDirectory(): void {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

export async function getRatesConfig(): Promise<RatesConfig> {
    if (cachedRates) {
        return cachedRates;
    }

    try {
        ensureDataDirectory();
        if (fs.existsSync(RATES_FILE)) {
            const raw = fs.readFileSync(RATES_FILE, "utf-8");
            const parsed = JSON.parse(raw) as Partial<RatesConfig>;
            
            if (
                parsed.basicRatePerSqFt &&
                parsed.moderateRatePerSqFt &&
                parsed.advanceRatePerSqFt &&
                Array.isArray(parsed.materials)
            ) {
                // Merge with defaults to guarantee all new features exist
                cachedRates = {
                    ...DEFAULT_RATES_CONFIG,
                    ...parsed,
                    packageFeatures: {
                        ...DEFAULT_RATES_CONFIG.packageFeatures,
                        ...(parsed.packageFeatures || {})
                    },
                    taxSettings: {
                        ...DEFAULT_RATES_CONFIG.taxSettings,
                        ...(parsed.taxSettings || {})
                    },
                    companyInfo: {
                        ...DEFAULT_RATES_CONFIG.companyInfo,
                        ...(parsed.companyInfo || {})
                    }
                };
                return cachedRates;
            }
        }
    } catch (err) {
        console.error("Error reading rates.json, falling back to default:", err);
    }

    cachedRates = { ...DEFAULT_RATES_CONFIG };
    try {
        ensureDataDirectory();
        fs.writeFileSync(RATES_FILE, JSON.stringify(cachedRates, null, 2), "utf-8");
    } catch (writeErr) {
        console.error("Failed to seed initial rates.json:", writeErr);
    }

    return cachedRates;
}

export async function saveRatesConfig(
    updates: Partial<RatesConfig>,
    updatedBy: string = "Admin"
): Promise<RatesConfig> {
    const current = await getRatesConfig();

    const newConfig: RatesConfig = {
        ...current,
        ...updates,
        basicRatePerSqFt: Number(updates.basicRatePerSqFt ?? current.basicRatePerSqFt),
        moderateRatePerSqFt: Number(updates.moderateRatePerSqFt ?? current.moderateRatePerSqFt),
        advanceRatePerSqFt: Number(updates.advanceRatePerSqFt ?? current.advanceRatePerSqFt),
        materials: updates.materials ? updates.materials.map(m => ({
            resource: m.resource,
            rate: Number(m.rate)
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

    ensureDataDirectory();
    const tempFile = `${RATES_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(newConfig, null, 2), "utf-8");
    fs.renameSync(tempFile, RATES_FILE);

    cachedRates = newConfig;
    return cachedRates;
}

export async function resetRatesConfig(updatedBy: string = "Admin (Reset)"): Promise<RatesConfig> {
    return saveRatesConfig(DEFAULT_RATES_CONFIG, updatedBy);
}
