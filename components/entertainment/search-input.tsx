"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";

function SearchInputInner({
  placeholder = "Search movies, TV shows...",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    startTransition(() => {
      router.push(
        `/entertainment/search?q=${encodeURIComponent(searchQuery.trim())}`,
      );
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Search
            className="h-5 w-5 cursor-pointer hover:text-primary transition-colors"
            onClick={() => handleSearch(query)}
          />
        )}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-muted/50 border border-border/10 rounded-2xl pl-12 pr-12 py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg backdrop-blur-md font-sans"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export function SearchInput(props: { placeholder?: string; className?: string }) {
  return (
    <Suspense fallback={<div className={`h-14 bg-muted/50 rounded-2xl animate-pulse ${props.className}`} />}>
      <SearchInputInner {...props} />
    </Suspense>
  );
}
