import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  try {
    const { slug } = await params;
    const slugPath = slug.join("/");
    const { searchParams } = new URL(req.url);
    const contentType = searchParams.get("contentType");

    const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
    const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
    const POSTHOG_API_HOST =
      process.env.POSTHOG_API_HOST || "https://us.posthog.com";

    if (!POSTHOG_PERSONAL_API_KEY || !POSTHOG_PROJECT_ID) {
      return NextResponse.json({ views: 0 }, { status: 200 });
    }

    // We use the query API to get the total number of $pageview events for this slug
    const queryObj = {
      kind: "TrendsQuery",
      series: [
        {
          kind: "EventsNode",
          event: "$pageview",
          name: "$pageview",
          math: "total",
        },
      ],
      properties: [
        {
          key: "page_slug",
          value: slugPath,
          operator: "exact",
          type: "event",
        },
        ...(contentType
          ? [
              {
                key: "content_type",
                value: contentType,
                operator: "exact",
                type: "event",
              },
            ]
          : []),
      ],
      dateRange: {
        date_from: "all",
      },
    };

    const endpoint = `${POSTHOG_API_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: queryObj }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("PostHog API error for view count:", response.statusText);
      return NextResponse.json({ views: 0 }, { status: 200 });
    }

    const data = await response.json();

    // In TrendsQuery, the total is usually in results[0].count or results[0].data
    // For a single series with no breakdown and total math, it should be an array of values over time if not aggregated
    // But since we want total, we might need to sum it up if PostHog returns it over time

    let totalViews = 0;
    if (data.results && data.results[0] && data.results[0].data) {
      // PostHog TrendsQuery returns an array of values for the date range
      totalViews = data.results[0].data.reduce(
        (acc: number, val: number) => acc + val,
        0,
      );
    } else if (
      data.results &&
      data.results[0] &&
      typeof data.results[0].count === "number"
    ) {
      totalViews = data.results[0].count;
    }

    return NextResponse.json(
      { views: totalViews },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        },
      },
    );
  } catch (error) {
    console.error("View count API error:", error);
    return NextResponse.json({ views: 0 }, { status: 200 });
  }
}
