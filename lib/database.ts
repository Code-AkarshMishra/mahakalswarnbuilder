import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type DatabaseClient = NeonQueryFunction<false, false>;

let schemaPromise: Promise<void> | null = null;

export function getDatabaseClient(): DatabaseClient | null {
    const connectionString = process.env.DATABASE_URL;
    return connectionString ? neon<false, false>(connectionString) : null;
}

export async function ensureDatabaseSchema(sql: DatabaseClient): Promise<void> {
    if (!schemaPromise) {
        schemaPromise = (async () => {
            await sql`
                CREATE TABLE IF NOT EXISTS site_settings (
                    setting_key TEXT PRIMARY KEY,
                    value JSONB NOT NULL,
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `;
            await sql`
                CREATE TABLE IF NOT EXISTS admin_credentials (
                    id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
                    username TEXT NOT NULL,
                    password_hash TEXT NOT NULL,
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `;
        })().catch((error) => {
            schemaPromise = null;
            throw error;
        });
    }

    await schemaPromise;
}
