"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewCounterProps {
  slug: string;
  contentType: string;
  className?: string;
}

export function ViewCounter({ slug, contentType, className }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await fetch(`/api/views/${slug}?contentType=${contentType}`);
        if (response.ok) {
          const data = await response.json();
          setViews(data.views);
        }
      } catch (error) {
        console.error("Failed to fetch views:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViews();
  }, [slug, contentType]);

  const formatViews = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-1.5 animate-pulse", className)}>
        <div className="h-3.5 w-3.5 rounded-full bg-muted" />
        <div className="h-3 w-8 rounded bg-muted" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-muted-foreground font-local-inter",
        className
      )}
    >
      <Eye className="h-3.5 w-3.5" />
      <span className="text-sm font-medium">
        {views !== null ? `${formatViews(views)} views` : "-- views"}
      </span>
    </div>
  );
}
