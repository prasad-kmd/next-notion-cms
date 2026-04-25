import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { systemLogs } from "@/lib/db/schema";
import { desc, eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        await requireAdmin();
        
        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "50");
        const service = searchParams.get("service");
        const level = searchParams.get("level");
        
        let query = db.select().from(systemLogs);
        let countQuery = db.select({ count: sql<number>`count(*)` }).from(systemLogs);
        
        const conditions = [];
        if (service && service !== 'all') {
            conditions.push(eq(systemLogs.service, service));
        }
        if (level && level !== 'all') {
            conditions.push(eq(systemLogs.level, level));
        }
        
        if (conditions.length > 0) {
            const combined = and(...conditions);
            if (combined) {
                query = query.where(combined) as unknown;
                countQuery = countQuery.where(combined) as unknown;
            }
        }
        
        const [logs, totalResult] = await Promise.all([
            query.orderBy(desc(systemLogs.createdAt)).limit(limit),
            countQuery
        ]);
        
        return NextResponse.json({
            logs,
            total: Number(totalResult[0]?.count || 0)
        });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
