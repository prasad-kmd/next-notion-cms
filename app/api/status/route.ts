import { NextResponse } from "next/server";
import {
  checkNotionHealth,
  checkSupabaseHealth,
} from "@/lib/system-monitor/health-checks";
import {
  getPublicOverallStatus,
  getPublicServices,
} from "@/lib/system-monitor/public-status";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Aggressive error handling for public endpoint
    const [notion, supabase] = await Promise.all([
      checkNotionHealth().catch(() => ({ status: "error" as const })),
      checkSupabaseHealth().catch(() => ({ status: "error" as const })),
    ]);

    const overallStatus = getPublicOverallStatus(
      notion.status,
      supabase.status,
    );
    const services = getPublicServices(notion.status, supabase.status);

    return NextResponse.json({
      overall_status: overallStatus,
      services: services,
      last_updated: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        overall_status: "major_outage",
        services: [],
        last_updated: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
