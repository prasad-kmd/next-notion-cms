"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, FileText, Briefcase, Library, BookOpen, HelpCircle, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PostMetadata, PostType } from "@/lib/content";
import { cn } from "@/lib/utils";

interface SearchResult extends PostMetadata {
  type: PostType;
}

export function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const getIcon = (type: PostType) => {
    switch (type) {
      case "blog": return <FileText size={18} />;
      case "projects": return <Briefcase size={18} />;
      case "wiki": return <Library size={18} />;
      case "articles": return <BookOpen size={18} />;
      case "quizzes": return <HelpCircle size={18} />;
      case "tutorials": return <GraduationCap size={18} />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 overflow-hidden pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[70vh] z-10"
          >
            <div className="flex items-center px-6 py-5 border-b border-border/50 gap-4">
              <SearchIcon className="text-muted-foreground shrink-0" size={24} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, projects, wiki..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-medium placeholder:text-muted-foreground/50 google-sans"
              />
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <p className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest google-sans">
                    Search Results ({results.length})
                  </p>
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.slug}`}
                      href={`/${result.type}/${result.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted transition-all group border border-transparent hover:border-border/50"
                    >
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground line-clamp-1 google-sans group-hover:text-primary transition-colors">
                          {result.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-1 google-sans opacity-70">
                          {result.description}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1 bg-muted/50 rounded-md border border-border/50 group-hover:text-primary transition-colors">
                        {result.type}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : query.trim().length >= 2 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground google-sans">No results found for &quot;{query}&quot;</p>
                </div>
              ) : (
                <div className="py-12 px-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Blog Posts", href: "/blog", icon: FileText },
                      { label: "Technical Wiki", href: "/wiki", icon: Library },
                      { label: "Engineering Projects", href: "/projects", icon: Briefcase },
                      { label: "Practical Tutorials", href: "/tutorials", icon: GraduationCap },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 p-4 rounded-2xl border border-border/50 hover:bg-muted transition-all group"
                      >
                        <item.icon className="text-primary opacity-60 group-hover:opacity-100 transition-opacity" size={18} />
                        <span className="font-bold text-sm google-sans">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border/50 bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground font-medium uppercase tracking-widest google-sans">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border border-border bg-background shadow-sm">ESC</kbd> to close</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border border-border bg-background shadow-sm">Enter</kbd> to select</span>
              </div>
              <div className="hidden sm:block">
                Powered by Engineering Index
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
