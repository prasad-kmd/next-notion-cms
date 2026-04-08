"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, ArrowRight, Trash2, Bookmark, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useEntertainmentBookmarks } from "@/hooks/use-entertainment-bookmarks";
import { cn } from "@/lib/utils";

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookmarksModal({ isOpen, onClose }: BookmarksModalProps) {
  const [mounted, setMounted] = useState(false);
  const { bookmarks, removeBookmark } = useBookmarks();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleItemClick = (type: string, slug: string) => {
    router.push(`/${type}/${slug}`);
    onClose();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-start justify-center p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold mozilla-headline">Bookmarks</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-8">
          {/* General Bookmarks Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground px-2 flex items-center gap-2">
              <Bookmark className="h-3 w-3" />
              General
            </h3>
            {bookmarks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/50">
                <p className="text-xs">No general bookmarks.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((item) => (
                  <div
                    key={`${item.type}-${item.slug}`}
                    className="group relative flex items-center gap-4 rounded-xl border border-transparent bg-muted/30 p-4 transition-all hover:border-primary/20 hover:bg-muted/50"
                  >
                    <button
                      onClick={() => handleItemClick(item.type, item.slug)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-1.5 py-0.5 rounded bg-primary/10">
                          {item.type}
                        </span>
                        {item.date && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 italic">
                        {item.title}
                      </h4>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeBookmark(item.slug, item.type)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {bookmarks.length > 0 && (
          <div className="border-t border-border px-6 py-4 bg-muted/10 shrink-0">
            <p className="text-[10px] text-muted-foreground text-center">
              Bookmarks are saved locally in your browser.
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
