import { NextResponse } from "next/server";
import { getContentByType } from "@/lib/content";

export async function GET() {
  const types = ["blog", "articles", "projects", "tutorials", "wiki"] as const;
  const allContent = types.flatMap((type) => {
    const items = getContentByType(type);
    return items.map((item) => ({
      slug: item.slug,
      title: item.title,
      description: item.description,
      type: type,
      date: item.date,
    }));
  });

  return NextResponse.json(allContent);
}
