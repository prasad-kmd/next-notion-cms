import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import {
  checkNotionHealth,
  checkSupabaseHealth,
  checkPostHogHealth,
} from "@/lib/system-monitor/health-checks";
import { logInfo } from "@/lib/system-logs";

export async function GET() {
  try {
    await requireAdmin();

    const [notion, supabase, posthog] = await Promise.all([
      checkNotionHealth(),
      checkSupabaseHealth(),
      checkPostHogHealth(),
    ]);

    await logInfo("system", "Global status refresh performed");

    return NextResponse.json({
      notion,
      supabase,
      posthog,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
