import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { cleanupOldLogs, logInfo } from "@/lib/system-logs";

export async function POST() {
    try {
        await requireAdmin();
        
        const result = await cleanupOldLogs();
        const deletedCount = (result as any).count || 0;
        
        await logInfo('system', `Manual log cleanup performed. Deleted ${deletedCount} old logs.`);

        return NextResponse.json({ success: true, deletedCount });
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
