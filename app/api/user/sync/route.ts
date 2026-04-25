import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const currentUser = await db.query.user.findFirst({
            where: eq(user.id, session.user.id),
        });

        if (!currentUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json({ 
            preferences: currentUser.preferences || {},
            synced: true 
        });
    } catch (error) {
        console.error("Fetch preferences error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { bookmarks, accentColor } = body;

        // Fetch current user preferences
        const currentUser = await db.query.user.findFirst({
            where: eq(user.id, session.user.id),
        });

        const currentPrefs = (currentUser?.preferences as unknown) || {};
        
        // Strategy: Merge local data with database data
        // For bookmarks, we merge and deduplicate by slug + type
        let mergedBookmarks = currentPrefs.bookmarks || [];
        if (bookmarks && Array.isArray(bookmarks)) {
            const existingSlugs = new Set(mergedBookmarks.map((b: unknown) => `${b.type}:${b.slug}`));
            
            for (const b of bookmarks) {
                if (!existingSlugs.has(`${b.type}:${b.slug}`)) {
                    mergedBookmarks.push(b);
                }
            }
        }

        // Limit bookmarks to prevent free tier storage exhaustion (e.g., max 50 bookmarks)
        if (mergedBookmarks.length > 50) {
            mergedBookmarks = mergedBookmarks.slice(-50);
        }

        const newPrefs = {
            ...currentPrefs,
            bookmarks: mergedBookmarks,
            accentColor: accentColor || currentPrefs.accentColor,
            lastSynced: new Date().toISOString(),
        };

        // Only update if there's an actual change to save on DB writes
        if (JSON.stringify(newPrefs) !== JSON.stringify(currentPrefs)) {
            await db.update(user)
                .set({ preferences: newPrefs })
                .where(eq(user.id, session.user.id));
            
            return NextResponse.json({ synced: true });
        }

        return NextResponse.json({ synced: false });
    } catch (error) {
        console.error("Sync error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
