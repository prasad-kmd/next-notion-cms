"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthorProfile } from "./author-profile";
import { Author } from "@/lib/content";

// interface TOCItem {
//   id: string;
//   text: string;
//   level: number;
// }

interface ArticleSidebarProps {
  content: string;
  author?: Author | null;
  lastUpdated?: string;
}

export function ArticleSidebar({
  content,
  author,
  lastUpdated,
}: ArticleSidebarProps) {
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);

  const headings = useMemo(() => {
    const headingRegex =
      /<h([2-4])\s+[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/h\1\s*>/gi;
    const matches = Array.from(content.matchAll(headingRegex));

    return matches.map((match) => {
      let cleanText = match[3];
      while (/<[^>]*>/g.test(cleanText)) {
        cleanText = cleanText.replace(/<[^>]*>/g, "");
      }
      return {
        level: parseInt(match[1]),
        id: match[2],
        text: cleanText.trim(),
      };
    });
  }, [content]);

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

  useEffect(() => {
    if (activeId && navRef.current) {
      const activeLink = navRef.current.querySelector(
        `a[href="#${activeId}"]`,
      ) as HTMLElement;
      if (activeLink) {
        activeLink.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeId]);

  return (
    <aside className="hidden lg:block w-72 shrink-0" data-print-hide="true">
      <div className="sticky top-20 flex flex-col gap-10 max-h-[calc(100vh-8rem)]">
        {author && <AuthorProfile author={author} lastUpdated={lastUpdated} />}

        {headings.length > 0 && (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-6 px-1 shrink-0">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground/50 font-google-sans">
                Table of Contents
              </p>
            </div>
            <nav
              ref={navRef}
              className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-8"
            >
              <ul className="space-y-1 border-l border-border/40 ml-0.5 font-local-inter">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(heading.id)?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className={cn(
                        "group flex items-center py-2 pr-4 transition-all hover:text-primary relative",
                        heading.level === 4
                          ? "pl-12 text-[11px]"
                          : heading.level === 3
                            ? "pl-8 text-xs"
                            : "pl-4 text-sm font-medium",
                        activeId === heading.id
                          ? "text-primary border-l-2 border-primary -ml-[1.5px] bg-primary/5"
                          : "text-muted-foreground border-l border-transparent",
                      )}
                    >
                      <span className="truncate">{heading.text}</span>
                      <ChevronRight
                        className={cn(
                          "h-3 w-3 ml-auto opacity-0 transition-all group-hover:opacity-100 shrink-0",
                          activeId === heading.id && "opacity-100",
                        )}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
