"use client";

import { Plus, Check } from "lucide-react";
import {
  useEntertainmentBookmarks,
  Bookmark,
} from "@/hooks/use-entertainment-bookmarks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookmarkButtonProps {
  item: Bookmark;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  showText?: boolean;
}

export function BookmarkButton({
  item,
  variant = "default",
  className,
  showText = true,
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useEntertainmentBookmarks();
  const bookmarked = isBookmarked(item.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(item);

    if (!bookmarked) {
      toast.success(`${item.title} added to My List`);
    } else {
      toast.info(`${item.title} removed from My List`);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-2 font-bold transition-all cursor-pointer font-sans",
        variant === "default" &&
          "bg-muted border border-border/30 backdrop-blur-md px-6 py-4 rounded-lg text-foreground hover:bg-muted/80",
        variant === "outline" &&
          "border border-primary/50 text-primary px-4 py-2 rounded-lg hover:bg-primary/10",
        variant === "ghost" && "text-muted-foreground hover:text-primary p-2",
        bookmarked && "border-primary text-primary",
        className,
      )}
      title={bookmarked ? "Remove from My List" : "Add to My List"}
    >
      {bookmarked ? (
        <Check className="h-5 w-5" />
      ) : (
        <Plus className="h-5 w-5" />
      )}
      {showText && (bookmarked ? "In My List" : "My List")}
    </button>
  );
}
