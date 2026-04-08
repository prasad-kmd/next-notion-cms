"use client";

import React from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { PostMetadata } from "@/lib/content";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookmarkButtonProps {
  post: PostMetadata;
  className?: string;
}

export function BookmarkButton({ post, className }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(post.slug, post.type || "");

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(post);
    if (!bookmarked) {
      toast.success("Added to bookmarks");
    } else {
      toast.info("Removed from bookmarks");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "p-2 rounded-xl transition-all duration-300",
        bookmarked
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      title={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
    </button>
  );
}
