"use client";

import React, { useState } from "react";
import { Printer, Loader2 } from "lucide-react";
import { exportToPDF } from "@/lib/pdf-export";
import { cn } from "@/lib/utils";

interface PrintButtonProps {
  postTitle: string;
  authorName?: string;
  publishDate?: string;
  contentElementId: string;
  className?: string;
}

export function PrintButton({
  postTitle,
  authorName,
  publishDate,
  contentElementId,
  className
}: PrintButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastClicked, setLastClicked] = useState(0);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    const now = Date.now();
    // Debounce to prevent rapid multiple clicks
    if (now - lastClicked < 2000) return;
    if (isGenerating) return;

    setLastClicked(now);
    setIsGenerating(true);

    try {
      await exportToPDF(contentElementId, {
        title: postTitle,
        author: authorName,
        date: publishDate,
      });
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isGenerating}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:bg-primary/50 relative group google-sans",
        "border-border text-muted-foreground",
        isGenerating && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label="Download as PDF"
      title="Download as PDF"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Printer className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">PDF</span>

      <span className="absolute left-1/2 -bottom-10 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border shadow-sm z-50">
        {isGenerating ? "Generating..." : "Download as PDF"}
      </span>
    </button>
  );
}
