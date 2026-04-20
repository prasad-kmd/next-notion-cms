"use client"

import { Bookmark } from "lucide-react"
import { useBookmarks, BookmarkedItem } from "@/hooks/use-bookmarks"
import { cn } from "@/lib/utils"

interface BookmarkButtonProps {
    item: BookmarkedItem
    className?: string
}

export function BookmarkButton({ item, className }: BookmarkButtonProps) {
    const { isBookmarked, toggleBookmark } = useBookmarks()
    const bookmarked = isBookmarked(item.slug, item.type)

    return (
        <button
            onClick={() => toggleBookmark(item)}
            className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:bg-primary/50 relative group google-sans",
                bookmarked
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground",
                className
            )}
        >
            <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
            <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
            <span className="absolute left-1/2 -bottom-10 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border shadow-sm z-50">
                {bookmarked ? "Remove Bookmark" : "Add to Bookmarks"}
            </span>
        </button>
    )
}
