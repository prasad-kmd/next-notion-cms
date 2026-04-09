"use client";

import { useState } from "react";
import { UnfoldVertical, FoldVertical } from "lucide-react";
import { FileText } from "lucide-react";

interface AuthorBioExpanderProps {
  html: string;
}

export function AuthorBioExpander({ html }: AuthorBioExpanderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-black amoriaregular text-foreground uppercase tracking-[0.2em] shrink-0">
          Readme
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>

      {/* Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-colors duration-300 hover:border-primary/20">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/30 select-none">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
            </div>
            <div className="h-4 w-px bg-border/60" />
            <div className="flex items-center gap-1.5">
              <FileText size={11} className="text-primary/50" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 local-jetbrains-mono">
                README.md
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-primary/20" />
            ))}
          </div>
        </div>

        {/* Content + fade overlay wrapper */}
        <div className="relative">
          {/* Scrollable content — height animated via max-height */}
          <div
            className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
            style={{ maxHeight: isExpanded ? "2000px" : "130px" }}
          >
            <div className="px-7 py-0 font-google-sans">
              <div
                className="
                  prose prose-sm dark:prose-invert max-w-none
                  prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tight prose-headings:amoriaregular
                  prose-h1:text-2xl prose-h2:text-xl prose-h3:text-base
                  prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:font-light prose-p:google-sans
                  prose-strong:text-foreground prose-strong:font-bold
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[11px] prose-code:local-jetbrains-mono
                  prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground/70 prose-blockquote:italic
                  prose-hr:border-border prose-li:text-muted-foreground prose-li:leading-relaxed
                  prose-ul:my-3 prose-ol:my-3 prose-li:my-0.5
                "
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>

          {/* Fade overlay — always rendered, fades out when expanded */}
          <div
            className="absolute bottom-0 left-0 right-0 h-28 flex items-end justify-center pb-4 transition-opacity duration-500 pointer-events-none"
            style={{
              opacity: isExpanded ? 0 : 1,
              background:
                "linear-gradient(to bottom, transparent 0%, hsl(var(--card)) 70%)",
            }}
          >
            <button
              onClick={() => setIsExpanded(true)}
              className="pointer-events-auto flex items-center gap-2 px-5 py-2 rounded-full border border-border/80 text-[8px] font-black uppercase tracking-[0.25em] text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            >
              <UnfoldVertical size={11} className="text-primary/50" />
              Expand
            </button>
          </div>
        </div>

        {/* Collapse button — below content, visible only when expanded */}
        <div
          className="flex items-center justify-center border-t border-border/60 transition-all duration-500 overflow-hidden"
          style={{
            maxHeight: isExpanded ? "60px" : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <button
            onClick={() => setIsExpanded(false)}
            className="my-3 flex items-center gap-2 px-5 py-2 rounded-full border border-border/80 text-[8px] font-black uppercase tracking-[0.25em] text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
          >
            <FoldVertical size={11} className="text-primary/50" />
            Collapse
          </button>
        </div>
      </div>
    </div>
  );
}
