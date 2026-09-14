export interface MaterialRateItem {
    resource: string;
    rate: number; // Rate per sq.ft
}

export interface TimelinePhaseItem {
    phase: string;
    days: number;
    color: string;
}

export interface PackageFeatures {
    basic: string[];
    moderate: string[];
    advance: string[];
}

export interface TaxSettings {
    cgstRate: number; // e.g. 5 for 5%
    sgstRate: number; // e.g. 5 for 5%
    enabled: boolean;
}

export interface CompanyInfo {
    phone: string;
    email: string;
    address: string;
    gstin: string;
    website: string;
}

export interface RatesConfig {
    basicRatePerSqFt: number;       // e.g. 1850
    moderateRatePerSqFt: number;    // e.g. 1985
    advanceRatePerSqFt: number;     // e.g. 2150
    materials: MaterialRateItem[];
    timeline: TimelinePhaseItem[];
    packageFeatures: PackageFeatures;
    taxSettings: TaxSettings;
    companyInfo: CompanyInfo;
    lastUpdated: string;
    updatedBy?: string;
}

export const DEFAULT_RATES_CONFIG: RatesConfig = {
    basicRatePerSqFt: 1850,
    moderateRatePerSqFt: 1985,
    advanceRatePerSqFt: 2150,
    materials: [
        { resource: "Cement", rate: 205.00 },
        { resource: "Steel", rate: 190.00 },
        { resource: "Bricks", rate: 175.00 },
        { resource: "Aggregate", rate: 120.00 },
        { resource: "Sand", rate: 140.00 },
        { resource: "Flooring", rate: 215.00 },
        { resource: "Windows", rate: 110.00 },
        { resource: "Doors", rate: 120.00 },
        { resource: "Electrical", rate: 85.00 },
        { resource: "Painting", rate: 180.00 },
        { resource: "Sanitary", rate: 45.00 },
        { resource: "Kitchen Work", rate: 175.00 },
        { resource: "Contractor (RCC/Civil)", rate: 225.00 }
    ],
    timeline: [
        { phase: "Home Design & Approval", days: 46, color: "bg-yellow-400" },
        { phase: "Excavation", days: 14, color: "bg-green-600" },
        { phase: "Footing & Foundation", days: 41, color: "bg-black" },
        { phase: "RCC Work - Slabs", days: 17, color: "bg-blue-600" },
        { phase: "Roof Slab", days: 37, color: "bg-red-600" },
        { phase: "Brickwork & Plaster", days: 8, color: "bg-pink-300" },
        { phase: "Flooring & Tiling", days: 25, color: "bg-purple-700" },
        { phase: "Electric Wiring", days: 14, color: "bg-yellow-500" },
        { phase: "Plumbing", days: 30, color: "bg-gray-500" },
        { phase: "Doors & Finishing", days: 15, color: "bg-red-800" },
    ],
    packageFeatures: {
        basic: [
            "Standard Grade Cement & TMT Steel",
            "Standard wiring & plumbing fixtures",
            "Vitrified Floor Tiles (Standard Grade)",
            "Structured quality tracking"
        ],
        moderate: [
            "Premium Brand Cement (UltraTech / ACC)",
            "Branded concealed wiring (Havells / Polycab)",
            "Premium Vitrified & Anti-skid tiles",
            "Standard timeline tracking with Vastu alignment"
        ],
        advance: [
            "High-Grade Fe550D Steel & Waterproof Cement",
            "Smart home ready automation & modular switches",
            "Italian Marble / Imported Wood Finishes",
            "Detailed 3D laser precision execution"
        ]
    },
    taxSettings: {
        cgstRate: 5,
        sgstRate: 5,
        enabled: true
    },
    companyInfo: {
        phone: "+91 87077 90653",
        email: "mahakalswarnbuilder@gmail.com",
        address: "Vibhuti Khand, Gomti Nagar, Lucknow, UP",
        gstin: "09CXUPT7007D1ZY",
        website: "www.mahakalswarnbuilder.in"
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: "System"
};

/**
 * Client-safe helper to compute category breakdown for a chosen tier
 */
export function getTierMaterialRates(
    tier: 'Basic' | 'Moderate' | 'Advance',
    config: RatesConfig
): MaterialRateItem[] {
    const moderateTotal = (config.materials || []).reduce((sum, item) => sum + item.rate, 0);
    const targetTotal =
        tier === 'Basic'
            ? config.basicRatePerSqFt
            : tier === 'Advance'
            ? config.advanceRatePerSqFt
            : config.moderateRatePerSqFt;

    if (moderateTotal <= 0 || !config.materials) {
        return (DEFAULT_RATES_CONFIG.materials || []).map(m => ({
            resource: m.resource,
            rate: targetTotal / DEFAULT_RATES_CONFIG.materials.length
        }));
    }

    const ratio = targetTotal / moderateTotal;
    return config.materials.map(m => ({
        resource: m.resource,
        rate: Number((m.rate * ratio).toFixed(2))
    }));
}
