"use client";

import React, { useRef, useEffect, useState, useMemo, startTransition } from "react";
import { cn } from "@/lib/utils";
import { BlockedWord } from "@/types/validation";

interface HighlightedTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  blockedWords?: BlockedWord[];
  highlightColor?: string;
}

export const HighlightedTextArea = React.forwardRef<
  HTMLTextAreaElement,
  HighlightedTextAreaProps
>(({ blockedWords = [], highlightColor = "rgba(239, 68, 68, 0.2)", className, value, onChange, ...props }, ref) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const combinedRef = (ref as React.MutableRefObject<HTMLTextAreaElement>) || internalRef;

  const [text, setText] = useState(String(value || ""));

  useEffect(() => {
    startTransition(() => {
        setText(String(value || ""));
    });
  }, [value]);

  const handleScroll = () => {
    if (backdropRef.current && combinedRef.current) {
      backdropRef.current.scrollTop = combinedRef.current.scrollTop;
      backdropRef.current.scrollLeft = combinedRef.current.scrollLeft;
    }
  };

  // Find matches of blocked words in the current text
  const highlights = useMemo(() => {
    if (!blockedWords.length || !text) return text;

    const uniqueWords = Array.from(new Set(blockedWords.map(bw => bw.word)));
    if (!uniqueWords.length) return text;

    // Create a regex to find all blocked words
    const escapedWords = uniqueWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedWords.join("|")})`, "gi");

    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (regex.test(part)) {
        return (
          <mark
            key={i}
            style={{ backgroundColor: highlightColor, color: "transparent", borderRadius: "2px" }}
            className="border-b border-red-500/50"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  }, [blockedWords, text, highlightColor]);

  return (
    <div className="relative w-full">
      <div
        ref={backdropRef}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 pointer-events-none whitespace-pre-wrap break-words overflow-auto text-transparent",
          "p-[10px] text-sm leading-relaxed border border-transparent",
          className
        )}
        style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
        }}
      >
        {highlights}
      </div>
      <textarea
        {...props}
        ref={combinedRef}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        className={cn(
          "relative bg-transparent block w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          "resize-none leading-relaxed",
          className
        )}
      />
    </div>
  );
});

HighlightedTextArea.displayName = "HighlightedTextArea";
