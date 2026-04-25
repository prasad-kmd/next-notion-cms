import { notion, DATABASE_IDS } from "../notion";
import { db } from "../db";
import { user } from "../db/schema";
import { sql } from "drizzle-orm";
import { determineStatus, SystemStatus } from "./status-utils";

export async function checkNotionHealth() {
    const start = performance.now();
    try {
        // Lightweight call: fetch a single database metadata
        await notion.databases.retrieve({ 
            database_id: DATABASE_IDS.blog 
        });
        
        const latency = performance.now() - start;
        
        // Notion doesn't expose rate limit headers in the client easily in a typed way
        // But we can check if it responded successfully
        const status = determineStatus(latency, false);

        return {
            status,
            latency_ms: Math.round(latency),
            databases_connected: Object.values(DATABASE_IDS).filter(Boolean).length,
            last_sync: new Date().toISOString(), // In a real app, this might come from a sync log
            error_message: null
        };
    } catch (error) {
        const latency = performance.now() - start;
        return {
            status: 'error' as SystemStatus,
            latency_ms: Math.round(latency),
            databases_connected: Object.values(DATABASE_IDS).filter(Boolean).length,
            last_sync: null,
            error_message: error instanceof Error ? error.message : 'Unknown Notion error'
        };
    }
}

export async function checkSupabaseHealth() {
    const start = performance.now();
    try {
        // Simple query to check DB connectivity
        const userCountResult = await db.select({ count: sql<number>`count(*)` }).from(user);
        const totalUsers = Number(userCountResult[0]?.count || 0);
        
        const latency = performance.now() - start;
        
        // Attempt to get DB size - might fail on some permissions
        let dbSize = null;
        try {
            const sizeResult = await db.execute(sql`SELECT pg_database_size(current_database())`);
            dbSize = Number((sizeResult as unknown as Array<{ pg_database_size: number }>)[0]?.pg_database_size || 0);
        } catch {
            // Ignore size fetch error
        }

        // Active connections
        let activeConnections = null;
        try {
            const connResult = await db.execute(sql`SELECT count(*) as count FROM pg_stat_activity`);
            activeConnections = Number((connResult as unknown as Array<{ count: number }>)[0]?.count || 0);
        } catch {
            // Ignore connection fetch error
        }

        const status = determineStatus(latency, false);

        return {
            status,
            latency_ms: Math.round(latency),
            total_users: totalUsers,
            database_size_bytes: dbSize,
            active_connections: activeConnections,
            error_message: null
        };
    } catch (error) {
        const latency = performance.now() - start;
        return {
            status: 'error' as SystemStatus,
            latency_ms: Math.round(latency),
            total_users: 0,
            database_size_bytes: null,
            active_connections: null,
            error_message: error instanceof Error ? error.message : 'Unknown Supabase error'
        };
    }
}

export async function checkPostHogHealth() {
    const start = performance.now();
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
    const projectId = process.env.POSTHOG_PROJECT_ID;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

    if (!apiKey || !projectId) {
        return {
            status: 'error' as SystemStatus,
            latency_ms: 0,
            error_message: 'PostHog credentials missing'
        };
    }

    try {
        const response = await fetch(`${host}/api/projects/${projectId}/`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            throw new Error(`PostHog API returned ${response.status}`);
        }

        const data = await response.json() as { name: string };
        const latency = performance.now() - start;
        const status = determineStatus(latency, false);

        return {
            status,
            latency_ms: Math.round(latency),
            project_name: data.name,
            project_id: projectId,
            error_message: null
        };
    } catch (error) {
        const latency = performance.now() - start;
        return {
            status: 'error' as SystemStatus,
            latency_ms: Math.round(latency),
            error_message: error instanceof Error ? error.message : 'Unknown PostHog error'
        };
    }
}
