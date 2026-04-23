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
    const { timeRange = "-30d", contentType, limit = 10, interval: userInterval, breakdownBy } = params;

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
            date_from: timeRange,
          },
        };
        break;
      case "summary_metrics":
        {
          const hogqlInterval = formatHogQLInterval(timeRange);
          queryObj = {
            kind: "HogQLQuery",
            query: `SELECT
              count() AS total_pageviews,
              count(DISTINCT distinct_id) AS unique_visitors,
              count() / count(DISTINCT properties.page_slug) AS avg_views_per_post,
              (SELECT count() FROM events WHERE event = 'comment_submitted' AND timestamp >= now() - INTERVAL ${hogqlInterval}) AS total_comments,
              (SELECT count() FROM events WHERE event = 'bookmark_added' AND timestamp >= now() - INTERVAL ${hogqlInterval}) AS total_bookmarks
              FROM events
              WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${hogqlInterval}`
          };
        }
        break;
      case "traffic_sources":
        {
          const hogqlInterval = formatHogQLInterval(timeRange);
          queryObj = {
            kind: "HogQLQuery",
            query: `SELECT
              multiIf(
                empty(properties.$referring_domain), 'Direct',
                properties.$referring_domain LIKE '%google.%', 'Google',
                properties.$referring_domain = 'github.com', 'GitHub',
                properties.$referring_domain IN ('t.co', 'twitter.com', 'x.com'), 'Twitter/X',
                properties.$referring_domain LIKE '%linkedin.%', 'LinkedIn',
                properties.$referring_domain
              ) AS source,
              count() AS count
              FROM events
              WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${hogqlInterval}
              GROUP BY source
              ORDER BY count DESC`
          };
        }
        break;
      case "device_breakdown":
        {
          const hogqlInterval = formatHogQLInterval(timeRange);
          queryObj = {
            kind: "HogQLQuery",
            query: `SELECT properties.$device_type AS device, count() AS count FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${hogqlInterval} GROUP BY device ORDER BY count DESC`
          };
        }
        break;
      case "browser_breakdown":
        {
          const hogqlInterval = formatHogQLInterval(timeRange);
          queryObj = {
            kind: "HogQLQuery",
            query: `SELECT properties.$browser AS browser, count() AS count FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${hogqlInterval} GROUP BY browser ORDER BY count DESC`
          };
        }
        break;
      case "os_breakdown":
        {
          const hogqlInterval = formatHogQLInterval(timeRange);
          queryObj = {
            kind: "HogQLQuery",
            query: `SELECT properties.$os AS os, count() AS count FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${hogqlInterval} GROUP BY os ORDER BY count DESC`
          };
        }
        break;
      case "country_breakdown":
        {
          const hogqlInterval = formatHogQLInterval(timeRange);
          queryObj = {
            kind: "HogQLQuery",
            query: `SELECT properties.$geoip_country_name AS country, count() AS count FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${hogqlInterval} GROUP BY country ORDER BY count DESC LIMIT ${limit}`
          };
        }
        break;
      case "outgoing_links":
        {
          const hogqlInterval = formatHogQLInterval(timeRange);
          queryObj = {
            kind: "HogQLQuery",
            query: `SELECT properties.target_domain AS domain, count() AS count FROM events WHERE event = 'outgoing_link_clicked' AND timestamp >= now() - INTERVAL ${hogqlInterval} GROUP BY domain ORDER BY count DESC LIMIT ${limit}`
          };
        }
        break;
      case "pageviews_trend_area":
        {
          queryObj = {
            kind: "TrendsQuery",
            series: [
              {
                kind: "EventsNode",
                event: "$pageview",
                name: "Pageviews",
                math: "total",
              },
            ],
            interval: userInterval || "day",
            dateRange: {
              date_from: timeRange,
            },
          };
        }
        break;
      case "multi_variable_insight":
        {
          queryObj = {
            kind: "TrendsQuery",
            series: [
              {
                kind: "EventsNode",
                event: "$pageview",
                name: "Pageviews",
                math: "total",
              },
            ],
            breakdownFilter: {
              breakdown: breakdownBy || "$device_type",
              breakdown_type: "event",
            },
            dateRange: {
              date_from: timeRange,
            },
          };
        }
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
    } else if (insightType === "summary_metrics") {
      if (Array.isArray(normalizedResult) && normalizedResult.length > 0) {
        const row = normalizedResult[0];

        // Fetch Notion content count
        let totalContent = 0;
        try {
          const { getContentByType } = await import("@/lib/content");
          const [blog, articles, projects, tutorials, wiki] = await Promise.all([
            getContentByType("blog"),
            getContentByType("articles"),
            getContentByType("projects"),
            getContentByType("tutorials"),
            getContentByType("wiki"),
          ]);
          totalContent = blog.length + articles.length + projects.length + tutorials.length + wiki.length;
        } catch (e) {
          console.error("Failed to fetch Notion stats for summary:", e);
        }

        normalizedResult = {
          total_pageviews: row[0],
          unique_visitors: row[1],
          avg_views_per_post: Math.round(row[2] || 0),
          total_comments: row[3],
          total_bookmarks: row[4],
          total_content: totalContent,
        };
      }
    } else if (["traffic_sources", "device_breakdown", "browser_breakdown", "os_breakdown", "country_breakdown", "outgoing_links"].includes(insightType)) {
      if (Array.isArray(normalizedResult) && normalizedResult.length > 0 && Array.isArray(normalizedResult[0])) {
        normalizedResult = normalizedResult.map((row: any[]) => ({
          label: row[0] || "Unknown",
          value: row[1]
        }));
      }
    }

    const data = {
      result: normalizedResult,
    };


    // Set appropriate cache headers based on insight type
    let cacheMaxAge = 300; // Default 5 minutes
    if (insightType === "country_breakdown") cacheMaxAge = 43200; // 12 hours
    if (["device_breakdown", "browser_breakdown", "os_breakdown"].includes(insightType)) cacheMaxAge = 21600; // 6 hours
    if (insightType === "summary_metrics") cacheMaxAge = 3600; // 1 hour

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${cacheMaxAge}, stale-while-revalidate=${cacheMaxAge * 2}`,
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
