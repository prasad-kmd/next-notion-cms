"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Search as SearchIcon,
  X,
  Calendar,
  ArrowRight,
  Loader2,
  Home,
  User,
  Briefcase,
  FileText,
  Settings,
  _Scaling,
  _Calculator,
  Image as _ImageIcon,
  _BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchResult {
  slug: string;
  title: string;
  description?: string;
  type: string;
  date?: string;
}

interface SearchProps {
  isMobileSidebar?: boolean;
}

export function Search({ isMobileSidebar = false }: SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allContent, setAllContent] = useState<SearchResult[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const _pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      if (allContent.length === 0 && !isFetching) {
        fetchContent();
      }
    }
  }, [isOpen, allContent.length, isFetching]);

  const fetchContent = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/search");
      const data = await res.json();
      setAllContent(data);
    } catch (error) {
      console.error("Failed to fetch search content:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      // If query is long enough, try fetching from Notion API if enabled
      if (query.length > 2) {
        setIsFetching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data.slice(0, 8));
        } catch (error) {
          console.error("Search fetch error:", error);
          // Fallback to local filtering
          filterLocal();
        } finally {
          setIsFetching(false);
        }
      } else {
        filterLocal();
      }
    }, 300);

    return () => clearTimeout(timeoutId);

    function filterLocal() {
      const filtered = allContent
        .filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 8);
      setResults(filtered);
    }
  }, [query, allContent]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  const handleResultClick = (type: string, slug: string) => {
    router.push(`/${type}/${slug}`);
    handleClose();
  };

  const handleSearchClick = () => {
    setIsOpen(!isOpen);
  };

  const quickLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Portfolio", href: "/portfolio", icon: Briefcase },
    { name: "Blog", href: "/blog", icon: FileText },
    { name: "Snippets", href: "/snippets", icon: FileText },
    { name: "Roadmap", href: "/roadmap", icon: Settings },
    { name: "What's Now", href: "/now", icon: User },
    { name: "Setup / Uses", href: "/uses", icon: Settings },
  ];

  // Desktop Search (Expands)
  if (!isMobileSidebar) {
    return (
      <div className="relative flex items-center" ref={containerRef}>
        <div
          className={cn(
            "flex items-center transition-all duration-300 ease-in-out overflow-hidden rounded-full border border-border bg-background/80 backdrop-blur shadow-lg",
            isOpen ? "w-64 px-3 py-1" : "w-0 border-none p-0",
          )}
        >
          <SearchIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={handleSearchClick}
              className={cn(
                "p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative group shrink-0",
                isOpen && "ml-2",
              )}
              aria-label="Search"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <SearchIcon className="h-5 w-5" />
              )}
            </button>
          </TooltipTrigger>
          {!isOpen && (
            <TooltipContent side="bottom" sideOffset={8}>
              Search
            </TooltipContent>
          )}
        </Tooltip>

        {isOpen && query && (
          <div className="absolute top-full right-0 mt-4 w-80 max-h-[400px] overflow-y-auto rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
            {isFetching ? (
              <div className="p-8 text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm">Loading index...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.slug}`}
                    onClick={() => handleResultClick(result.type, result.slug)}
                    className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-primary/70">
                        {result.type}
                      </span>
                      {result.date && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(result.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors mt-1">
                      {result.title}
                    </h4>
                    {result.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {result.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">
                  No results found for &quot;{query}&quot;
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Mobile Search (Modal)
  return (
    <>
      <button
        onClick={handleSearchClick}
        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative group"
        aria-label="Search"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 sm:p-6 md:p-20">
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={handleClose}
            />
            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
              <div className="flex items-center border-b border-border px-4 py-4 shrink-0">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search articles, projects, tutorials..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                      handleClose();
                    }
                  }}
                  className="ml-3 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleClose}
                  className="rounded-lg p-1 hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 max-h-[70vh] custom-scrollbar">
                {isFetching ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Updating search index...</p>
                  </div>
                ) : query ? (
                  results.length > 0 ? (
                    <div className="space-y-1">
                      {results.map((result) => (
                        <button
                          key={`${result.type}-${result.slug}`}
                          onClick={() =>
                            handleResultClick(result.type, result.slug)
                          }
                          className="w-full text-left p-4 rounded-xl hover:bg-muted transition-colors group flex items-center justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-1.5 py-0.5 rounded bg-primary/10">
                                {result.type}
                              </span>
                              {result.date && (
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(result.date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {result.title}
                            </h4>
                            {result.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                {result.description}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">
                      <p>No results found for &quot;{query}&quot;</p>
                    </div>
                  )
                ) : (
                  <div className="p-2">
                    <div className="mb-4 px-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                        Navigation
                      </h3>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {quickLinks.map((link) => (
                          <button
                            key={link.href}
                            onClick={() => {
                              router.push(link.href);
                              handleClose();
                            }}
                            className="flex items-center gap-3 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <link.icon className="h-4 w-4" />
                            {link.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="px-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                        Categories
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[
                          "blog",
                          "articles",
                          "projects",
                          "tutorials",
                          "wiki",
                        ].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className="px-3 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-xs transition-colors capitalize"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 border-t border-border pt-4 px-3 pb-2 text-[10px] text-muted-foreground flex items-center justify-between">
                      <div className="flex gap-4">
                        <span>
                          <kbd className="rounded bg-muted px-1.5 py-0.5 font-sans">
                            ↑↓
                          </kbd>{" "}
                          to navigate
                        </span>
                        <span>
                          <kbd className="rounded bg-muted px-1.5 py-0.5 font-sans">
                            ↵
                          </kbd>{" "}
                          to select
                        </span>
                      </div>
                      <span>
                        <kbd className="rounded bg-muted px-1.5 py-0.5 font-sans">
                          esc
                        </kbd>{" "}
                        to close
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
