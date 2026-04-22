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
    const { insightType, params = {} } = body;
    const { timeRange = "-30d", contentType, limit = 10 } = params;

    // Helper to convert PostHog time range to HogQL interval
    const formatHogQLInterval = (range: string) => {
      const value = range.replace(/^-/, "");
      const num = parseInt(value) || 30;
      const unit = value.replace(/^\d+/, "").toLowerCase();

      switch (unit) {
        case "h": return `${num} HOUR`;
        case "d": return `${num} DAY`;
        case "w": return `${num} WEEK`;
        case "m": return `${num} MONTH`;
        default: return `${num} DAY`;
      }
    };

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
            date_from: timeRange,
          },
        };
        break;
      case "top_content":
        {
          const contentTypeFilter = contentType
            ? `AND properties.content_type = '${contentType}'`
            : "AND properties.page_slug IS NOT NULL";

          const interval = formatHogQLInterval(timeRange);

          queryObj = {
            kind: "HogQLQuery",
            query: `SELECT properties.page_slug AS slug, any(properties.page_title) AS title, any(properties.content_type) AS type, count() AS views FROM events WHERE event = '$pageview' ${contentTypeFilter} AND timestamp >= now() - INTERVAL ${interval} GROUP BY slug ORDER BY views DESC LIMIT ${limit}`
          };
        }
        break;
      case "content_trends":
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
          breakdownFilter: {
            breakdown: "content_type",
            breakdown_type: "event",
          },
          dateRange: {
            date_from: timeRange,
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

    if (process.env.NODE_ENV === "development") {
      console.log(`Analytics API: Fetching ${insightType}`, { queryObj });
    }

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
      console.error(`PostHog API response error (${insightType}):`, {
        status: response.status,
        endpoint: endpoint.split("?")[0],
        errorData,
        sentQuery: queryObj,
      });
      return NextResponse.json(errorData, { status: response.status });
    }

    const json = await response.json();
    // Normalize response to maintain compatibility with existing chart code
    // The query API returns `.results` instead of `.result`
    // For HogQLQuery, it returns results as an array of arrays
    let normalizedResult = json.results || json.result || [];

    if (insightType === "top_content") {
      // For HogQL queries, results are an array of arrays
      if (Array.isArray(normalizedResult) && normalizedResult.length > 0 && Array.isArray(normalizedResult[0])) {
        normalizedResult = normalizedResult.map((row: any[]) => ({
          slug: row[0],
          title: row[1] || row[0],
          type: row[2],
          views: row[3]
        }));
      }
    }

    const data = {
      result: normalizedResult,
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
