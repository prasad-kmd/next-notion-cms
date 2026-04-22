import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const body = await req.json();
    const { insightType, params } = body;

    const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
    const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
    const POSTHOG_API_HOST = process.env.POSTHOG_API_HOST || "https://us.posthog.com";

    if (!POSTHOG_PERSONAL_API_KEY || !POSTHOG_PROJECT_ID) {
      return NextResponse.json(
        { error: "PostHog is not configured" },
        { status: 400 }
      );
    }

    let endpoint = "";
    switch (insightType) {
      case "total_pageviews":
        endpoint = `${POSTHOG_API_HOST}/api/projects/${POSTHOG_PROJECT_ID}/insights/trend/?events=[{"id":"$pageview","name":"$pageview","type":"events"}]&date_from=-30d&period=day`;
        break;
      case "top_pages":
        endpoint = `${POSTHOG_API_HOST}/api/projects/${POSTHOG_PROJECT_ID}/insights/trend/?events=[{"id":"$pageview","name":"$pageview","type":"events","math":"dau"}]&breakdown=$current_url&date_from=-30d`;
        break;
      default:
        return NextResponse.json({ error: "Invalid insight type" }, { status: 400 });
    }

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
  } catch (error: any) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
