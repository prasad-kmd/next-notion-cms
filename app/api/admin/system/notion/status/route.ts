import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { checkNotionHealth } from "@/lib/system-monitor/health-checks";
import { logInfo, logError } from "@/lib/system-logs";

export async function GET() {
    try {
        await requireAdmin();
        const health = await checkNotionHealth();
        
        if (health.status === 'error') {
            await logError('notion', `Notion Health Check Failed: ${health.error_message}`, health);
        } else {
            await logInfo('notion', `Notion Health Check: ${health.status} (${health.latency_ms}ms)`, health);
        }

        return NextResponse.json(health);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
