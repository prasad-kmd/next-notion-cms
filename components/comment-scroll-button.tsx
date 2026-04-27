"use client";

import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentScrollButtonProps {
  className?: string;
}

export function CommentScrollButton({ className }: CommentScrollButtonProps) {
  const scrollToComments = () => {
    const element = document.getElementById("comments");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <button
      onClick={scrollToComments}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:bg-primary/5 hover:border-primary/30 relative group font-google-sans border-border text-muted-foreground",
        className,
      )}
    >
      <MessageSquare className="h-4 w-4" />
      <span>Comment</span>
      <span className="absolute left-1/2 -bottom-10 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border shadow-sm z-50">
        Go to Discussion
      </span>
    </button>
  );
}
