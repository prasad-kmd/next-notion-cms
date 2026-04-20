import { NextRequest, NextResponse } from "next/server";
import { notion } from "@/lib/notion";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { formatComment, containsProfanity } from "@/lib/comments";
import { isRateLimited } from "@/lib/rate-limit";

const RATE_LIMIT_CONFIG = {
  limit: 5,
  window: 60 * 1000, // 5 comments per minute
};

/**
 * GET /api/comments?pageId=...&cursor=...
 * Fetches comments for a specific Notion page.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get("pageId");
  const cursor = searchParams.get("cursor") || undefined;

  if (!pageId) {
    return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
  }

  try {
    const response = await notion.comments.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 20,
    });

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments
 * Creates a new comment on a specific Notion page.
 * Requires authentication.
 */
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting
  const userId = session.user.id;
  if (isRateLimited(userId, RATE_LIMIT_CONFIG)) {
    return NextResponse.json(
      { error: "Too many comments. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { pageId, content } = body;

    if (!pageId || !content) {
      return NextResponse.json(
        { error: "Missing pageId or content" },
        { status: 400 }
      );
    }

    if (containsProfanity(content)) {
      return NextResponse.json(
        { error: "Comment contains prohibited content." },
        { status: 400 }
      );
    }

    const user = session.user;
    const fullContent = formatComment(
        user.name || "Anonymous",
        user.id,
        content,
        user.image || undefined
    );

    const response = await notion.comments.create({
      parent: {
        page_id: pageId,
      },
      rich_text: [
        {
          text: {
            content: fullContent,
          },
        },
      ],
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
