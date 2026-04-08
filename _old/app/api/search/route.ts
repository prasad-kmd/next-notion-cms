import { NextResponse } from "next/server";
import { getAllPosts, PostType } from "@/lib/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json([]);
  }

  const contentTypes: PostType[] = ["blog", "projects", "wiki", "articles", "quizzes", "tutorials"];
  
  const allContent = await Promise.all(
    contentTypes.map(async (type) => {
      const posts = await getAllPosts(type);
      return posts.map(post => ({ ...post, type }));
    })
  );

  const flattenedContent = allContent.flat();

  const results = flattenedContent.filter((item) => {
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
      item.category?.toLowerCase().includes(query)
    );
  }).slice(0, 10);

  return NextResponse.json(results);
}
