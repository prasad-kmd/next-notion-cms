import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidateTag } from "next/cache";
import { logInfo } from "@/lib/system-logs";

export async function POST() {
    try {
        const session = await requireAdmin();
        
        // Purge Notion-related caches
        revalidateTag("notion-content");
        revalidateTag("comments");
        
        await logInfo('notion', 'Cache purged manually', { admin: session.user.email });

        return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
