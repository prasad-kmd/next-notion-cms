import { NextResponse } from "next/server";
import { getContentByType } from "@/lib/content";

export async function GET() {
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
