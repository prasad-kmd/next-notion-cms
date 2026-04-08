"use client";

import { Heading } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" },
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-4">
      <div className="flex items-center gap-2 mb-6 px-1 sticky top-0 z-10 py-1">
        <div className="h-1 w-1 rounded-full bg-primary" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/50">
          Table of Contents
        </p>
      </div>
      <ul className="space-y-1 border-l border-border/40 ml-0.5">
        {headings.map((heading) => (
          <li key={heading.id} className="relative">
            <a
              href={`#${heading.id}`}
              className={cn(
                "block py-2 pr-4 transition-all duration-200 hover:text-primary relative group",
                heading.level === 3
                  ? "pl-6 text-[13px]"
                  : "pl-4 text-sm font-medium",
                activeId === heading.id
                  ? "text-primary border-l-2 border-primary -ml-[1.5px] bg-primary/5"
                  : "text-muted-foreground border-l border-transparent",
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <span className="truncate block">{heading.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
