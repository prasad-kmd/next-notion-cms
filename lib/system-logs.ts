import { db } from "./db";
import { systemLogs } from "./db/schema";
import { sql } from "drizzle-orm";

export type LogService = 'notion' | 'supabase' | 'posthog' | 'system';
export type LogLevel = 'info' | 'warning' | 'error';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function logInfo(service: LogService, message: string, metadata: any = {}) {
    return log('info', service, message, metadata);
}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function logWarning(service: LogService, message: string, metadata: any = {}) {
    return log('warning', service, message, metadata);
}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function logError(service: LogService, message: string, metadata: any = {}) {
    return log('error', service, message, metadata);
}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
async function log(level: LogLevel, service: LogService, message: string, metadata: any = {}) {
    try {
        await db.insert(systemLogs).values({
            service,
            level,
            message,
            metadata,
        });

        // Periodic cleanup with 10% probability
        if (Math.random() < 0.1) {
            cleanupOldLogs().catch(err => console.error('Failed to cleanup old logs:', err));
        }
    } catch (error) {
        console.error(`Failed to log ${level} for ${service}:`, error);
    }
}

export async function cleanupOldLogs() {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const result = await db.delete(systemLogs)
            .where(sql`${systemLogs.createdAt} < ${sevenDaysAgo}`);
        
        return result;
    } catch (error) {
        console.error('Error cleaning up logs:', error);
        throw error;
    }
}
