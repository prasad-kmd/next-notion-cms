"use client";

import { ParsedComment, parseComment } from "@/lib/comments";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import Image from "next/image";

interface CommentItemProps {
  comment: any; // Notion comment object
}

export function CommentItem({ comment }: CommentItemProps) {
  const plainText = comment.rich_text.map((t: any) => t.plain_text).join("");
  const parsed = parseComment(plainText);
  const date = new Date(comment.created_time);

  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-border/40 bg-card/50 hover:bg-card/80 transition-colors group">
      <div className="shrink-0">
        {parsed.author.avatar ? (
          <div className="relative h-10 w-10 rounded-full overflow-hidden border border-border/60">
            <Image
              src={parsed.author.avatar}
              alt={parsed.author.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
            <User className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-bold text-sm text-foreground truncate">
            {parsed.author.name}
            {parsed.isBot && (
              <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                via Notion
              </span>
            )}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
          {parsed.content}
        </p>
      </div>
    </div>
  );
}
