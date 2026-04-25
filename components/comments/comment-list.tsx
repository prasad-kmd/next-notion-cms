"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { CommentItem } from "./comment-item";
import { Loader2, MessageSquare, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  rich_text: Array<{ plain_text: string }>;
  created_time: string;
}

interface CommentListProps {
  pageId: string;
  initialComments?: Comment[];
  newComments?: Comment[];
  onCountUpdate?: (count: number) => void;
}

export function CommentList({ 
  pageId, 
  initialComments = [], 
  newComments = [],
  onCountUpdate
}: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadingRef = useRef(false);

  const fetchComments = useCallback(async (currentCursor?: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const url = `/api/comments?pageId=${pageId}${currentCursor ? `&cursor=${currentCursor}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch comments");
      
      const data = await res.json();
      
      if (currentCursor) {
        setComments(prev => [...prev, ...data.results]);
      } else {
        setComments(data.results);
        if (onCountUpdate) onCountUpdate(data.results.length);
      }
      
      setCursor(data.next_cursor);
      setHasMore(data.has_more);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [pageId, onCountUpdate]);

  // Initial load
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchComments(cursor || undefined);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, cursor, fetchComments]);

  const allComments = [...newComments, ...comments].filter(
    (c, index, self) => index === self.findIndex((t) => t.id === c.id)
  );

  if (!isLoading && allComments.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center gap-4 opacity-50">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <MessageSquare className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium font-local-jetbrains-mono">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {allComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {(hasMore || isLoading) && (
        <div ref={observerTarget} className="py-8 flex justify-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-primary font-space-mono" />
              Loading discussion...
            </div>
          )}
          {!isLoading && hasMore && (
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => fetchComments(cursor || undefined)}
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors font-local-jetbrains-mono"
            >
                <ArrowDown className="h-3 w-3 mr-2" />
                Load More Comments
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
