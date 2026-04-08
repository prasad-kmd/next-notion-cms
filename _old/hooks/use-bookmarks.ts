"use client";

import { useState, useEffect } from "react";
import { PostMetadata } from "@/lib/content";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<PostMetadata[]>([]);

  const loadBookmarks = () => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    } else {
      setBookmarks([]);
    }
  };

  useEffect(() => {
    loadBookmarks();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bookmarks") {
        loadBookmarks();
      }
    };

    const handleCustomEvent = () => loadBookmarks();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("bookmarks-updated", handleCustomEvent);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bookmarks-updated", handleCustomEvent);
    };
  }, []);

  const toggleBookmark = (post: PostMetadata) => {
    const currentBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const isExist = currentBookmarks.some((b: any) => b.slug === post.slug && b.type === post.type);
    
    const newBookmarks = isExist
      ? currentBookmarks.filter((b: any) => !(b.slug === post.slug && b.type === post.type))
      : [...currentBookmarks, post];
    
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
    window.dispatchEvent(new Event("bookmarks-updated"));
  };

  const isBookmarked = (slug: string, type: string) => {
    return bookmarks.some((b) => b.slug === slug && b.type === type);
  };

  return { bookmarks, toggleBookmark, isBookmarked };
}
