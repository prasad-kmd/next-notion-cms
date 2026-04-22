import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication manually to avoid redirect issues in API route
    const { auth } = await import("@/lib/auth");
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { insightType, params } = body;

    const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
    const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
    const POSTHOG_API_HOST =
      process.env.POSTHOG_API_HOST || "https://us.posthog.com";

    if (!POSTHOG_PERSONAL_API_KEY || !POSTHOG_PROJECT_ID) {
      return NextResponse.json(
        { error: "PostHog is not configured" },
        { status: 400 },
      );
    }

    let queryObj = {};
    switch (insightType) {
      case "total_pageviews":
        queryObj = {
          kind: "TrendsQuery",
          series: [
            {
              kind: "EventsNode",
              event: "$pageview",
              name: "$pageview",
              math: "total",
            },
          ],
          dateRange: {
            date_from: "-30d",
          },
        };
        break;
      case "top_pages":
        queryObj = {
          kind: "TrendsQuery",
          series: [
            {
              kind: "EventsNode",
              event: "$pageview",
              name: "$pageview",
              math: "dau",
            },
          ],
          breakdownFilter: {
            breakdown: "$current_url",
            breakdown_type: "event",
          },
          dateRange: {
            date_from: "-30d",
          },
        };
        break;
      default:
        return NextResponse.json(
          { error: "Invalid insight type" },
          { status: 400 },
        );
    }

    const endpoint = `${POSTHOG_API_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: queryObj }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("PostHog API response error:", {
        status: response.status,
        endpoint: endpoint.split("?")[0], // Log endpoint without sensitive query params if any
        errorData,
      });
      return NextResponse.json(errorData, { status: response.status });
    }

    const json = await response.json();
    // Normalize response to maintain compatibility with existing chart code
    // The query API returns `.results` instead of `.result`
    const data = {
      result: json.results || json.result || [],
    };


    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    console.error("Analytics API error:", error);
    // Ensure we return a NextResponse even in the catch block
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
