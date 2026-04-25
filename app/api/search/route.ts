import { NextRequest, NextResponse } from "next/server";
import { getContentByType } from "@/lib/content";
import { searchNotion, isNotionEnabled, getPlainText, getDate, DATABASE_IDS } from "@/lib/notion";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  // If a query is provided and Notion is enabled, use native Notion search for real-time results
  if (query && isNotionEnabled) {
    try {
      const notionResults = await searchNotion(query);
      
      // Filter results to only include those that belong to our databases
      // This is a bit tricky as notion.search doesn't allow filtering by database ID easily
      // So we'll map them and try to infer the type
      const results = notionResults
        .filter((page: unknown) => (page as unknown).object === "page" && (page as unknown).parent?.type === "database_id")
        .map((page: unknown) => {
          const props = (page as unknown).properties;
          const title = getPlainText(props.Name || props.Title);
          const slug = getPlainText(props.Slug);
          const date = getDate(props.Date);
          const description = getPlainText(props.Description);
          
          // Map database ID to type
          const dbId = (page as unknown).parent.database_id.replace(/-/g, "");
          let type = "content";
          
          Object.entries(DATABASE_IDS).forEach(([key, value]) => {
            if (value && value.replace(/-/g, "") === dbId) {
              type = key;
            }
          });
          
          return {
            slug,
            title,
            description,
            type,
            date,
          };
        })
        .filter(item => item.slug && item.title && item.type !== "authors" && item.type !== "content");

      return NextResponse.json(results);
    } catch (error) {
      console.error("API Notion search error:", error);
    }
  }

  const types = ["blog", "articles", "projects", "tutorials", "wiki"] as const;
  const allContentPromises = types.map(async (type) => {
    const items = await getContentByType(type);
    return items.map((item) => ({
      slug: item.slug,
      title: item.title,
      description: item.description,
      type: type,
      date: item.date,
    }));
  });

  const allContent = (await Promise.all(allContentPromises)).flat();

  return NextResponse.json(allContent);
}
