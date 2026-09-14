import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mahakalswarnbuilder.in";
    const lastModified = new Date();

    return [
        {
            url: `${baseUrl}/`,
            lastModified,
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/sitemap`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];
}