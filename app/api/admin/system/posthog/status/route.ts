import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { checkPostHogHealth } from "@/lib/system-monitor/health-checks";
import { logInfo, logError } from "@/lib/system-logs";

export async function GET() {
    try {
        await requireAdmin();
        const health = await checkPostHogHealth();
        
        if (health.status === 'error') {
            await logError('posthog', `PostHog Health Check Failed: ${health.error_message}`, health);
        } else {
            await logInfo('posthog', `PostHog Health Check: ${health.status} (${health.latency_ms}ms)`, health);
        }

        return NextResponse.json(health);
    } catch (error: any) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
