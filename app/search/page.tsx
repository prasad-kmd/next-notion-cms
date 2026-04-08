"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import {
  Search as SearchIcon,
  Loader2,
  ArrowRight,
  Calendar,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

interface SearchResult {
  slug: string;
  title: string;
  description?: string;
  type: string;
  date?: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  const [allContent, setAllContent] = useState<SearchResult[]>([]);

  useEffect(() => {
    async function fetchAllContent() {
      try {
        const response = await fetch("/api/search");
        const data = await response.json();
        setAllContent(data);
      } catch (error) {
        console.error("Failed to fetch search content:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllContent();
  }, []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const terms = query.toLowerCase().split(/\s+/);
    return allContent.filter((item) => {
      const titleMatch = item.title.toLowerCase();
      const descMatch = item.description?.toLowerCase() || "";
      const typeMatch = item.type.toLowerCase();
      return terms.every(
        (term) =>
          titleMatch.includes(term) ||
          descMatch.includes(term) ||
          typeMatch.includes(term),
      );
    });
  }, [query, allContent]);

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="mb-8 text-4xl font-bold mozilla-headline flex items-center gap-3">
            <SearchIcon className="h-10 w-10 text-primary" />
            Search Results
          </h1>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, blog posts, projects, tutorials, and wiki..."
              className="pl-12 h-14 bg-card/50 backdrop-blur-sm border-border text-lg"
              autoFocus
            />
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse font-mono text-sm tracking-widest">
              INDEXING_CONTENT...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{filteredResults.length} results found</span>
              {query && (
                <span className="italic">
                  Showing results for &quot;{query}&quot;
                </span>
              )}
            </div>

            {filteredResults.length > 0
              ? filteredResults.map((result) => (
                  <Link
                    key={`${result.type}-${result.slug}`}
                    href={`/${result.type}/${result.slug}`}
                    className="group block rounded-2xl border border-border bg-card/40 p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {result.type}
                          </span>
                          {result.date && (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono uppercase">
                              <Calendar className="h-3 w-3" />
                              {new Date(result.date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <h2 className="mb-2 text-2xl font-bold group-hover:text-primary transition-colors google-sans">
                          {result.title}
                        </h2>
                        {result.description && (
                          <p className="text-muted-foreground leading-relaxed line-clamp-2 italic text-sm">
                            {result.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary mt-1" />
                    </div>
                  </Link>
                ))
              : query && (
                  <div className="text-center py-20 rounded-3xl border border-dashed border-border bg-card/20">
                    <p className="text-muted-foreground text-lg">
                      No results found for &quot;{query}&quot;
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try using different keywords or checking for typos.
                    </p>
                  </div>
                )}

            {!query && (
              <div className="text-center py-20">
                <Tag className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter a search term above to begin exploring our knowledge
                  base.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading Search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
