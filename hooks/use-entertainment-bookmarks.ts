"use client";

import { useState, useEffect, useCallback, useRef, startTransition } from "react";

export interface Bookmark {
  id: number;
  type: "movie" | "tv";
  title: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

export function useEntertainmentBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const isInitialized = useRef(false);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("entertainment-bookmarks");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            startTransition(() => {
              setBookmarks(parsed);
            });
          }
        } catch (e) {
          console.error("Failed to parse entertainment bookmarks:", e);
        }
      }
      isInitialized.current = true;
    }

    const handleStorageChange = () => {
      const updated = localStorage.getItem("entertainment-bookmarks");
      if (updated) {
        try {
          const parsed = JSON.parse(updated);
          if (Array.isArray(parsed)) {
            startTransition(() => {
              setBookmarks(parsed);
            });
          }
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Sync back to localStorage
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem("entertainment-bookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  const toggleBookmark = useCallback((item: Bookmark) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id && b.type === item.type);
      if (exists) {
        return prev.filter((b) => !(b.id === item.id && b.type === item.type));
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const removeBookmark = useCallback((id: number, type: "movie" | "tv") => {
    setBookmarks((prev) => prev.filter((b) => !(b.id === id && b.type === type)));
  }, []);

  const isBookmarked = useCallback(
    (id: number) => {
      return bookmarks.some((b) => b.id === id);
    },
    [bookmarks],
  );

  return { bookmarks, toggleBookmark, removeBookmark, isBookmarked };
}
