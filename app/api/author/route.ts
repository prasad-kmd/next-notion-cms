import { NextRequest, NextResponse } from "next/server";
import { getAuthorBasic } from "@/lib/content";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const author = await getAuthorBasic(slug);

  if (!author) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  return NextResponse.json(author);
}
