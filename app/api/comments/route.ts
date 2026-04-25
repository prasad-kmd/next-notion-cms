import { NextRequest, NextResponse } from "next/server";
import { notion } from "@/lib/notion";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { formatComment } from "@/lib/comments";
import { isRateLimited } from "@/lib/rate-limit";
// import { env } from "@/lib/env";
import { validateComment, verifyTurnstile } from "@/lib/validation/validate";

const RATE_LIMIT_CONFIG = {
  limit: 3,
  window: 60 * 1000, // 3 comments per minute
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
  } catch (error: unknown) {
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
      { error: "Too many comments. Please wait a moment.", type: "rate_limit" },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { pageId, content, turnstileToken } = body;

    if (!pageId || !content) {
      return NextResponse.json(
        { error: "Missing pageId or content" },
        { status: 400 }
      );
    }

    // Turnstile verification
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Security verification missing", type: "turnstile" },
        { status: 400 }
      );
    }

    const isTurnstileValid = await verifyTurnstile(turnstileToken);
    if (!isTurnstileValid) {
      return NextResponse.json(
        { error: "Security verification failed", type: "turnstile" },
        { status: 400 }
      );
    }

    const validationResult = await validateComment(content);
    if (!validationResult.success) {
      // Log blocked attempt (counts/patterns only)
      console.log(`[Profanity Blocked] User: ${userId}, Count: ${validationResult.error.blockedWords?.length}`);
      
      return NextResponse.json(
        { 
          error: validationResult.error.message,
          type: validationResult.error.type,
          blockedWords: validationResult.error.blockedWords
        },
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
  } catch (error: unknown) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
