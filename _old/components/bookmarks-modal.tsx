"use client";

import React from "react";
import { Bookmark, X, ArrowRight, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookmarks } from "@/hooks/use-bookmarks";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BookmarksModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { bookmarks, toggleBookmark } = useBookmarks();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh] z-10"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Bookmark size={20} fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-bold text-xl google-sans">Your Bookmarks</h3>
                  <p className="text-xs text-muted-foreground google-sans font-medium uppercase tracking-widest">
                    {bookmarks.length} {bookmarks.length === 1 ? 'Item' : 'Items'} Saved
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {bookmarks.length > 0 ? (
                <div className="grid gap-3">
                  {bookmarks.map((post) => (
                    <div
                      key={`${post.type}-${post.slug}`}
                      className="group flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:bg-muted/50 transition-all"
                    >
                      {post.image ? (
                        <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-border/50">
                          <img src={post.image} alt="" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-16 w-16 shrink-0 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                          <Bookmark size={20} />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/${post.type}/${post.slug}`} 
                          onClick={onClose}
                          className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1 google-sans"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">
                          {post.type}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBookmark(post)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <Link
                          href={`/${post.type}/${post.slug}`}
                          onClick={onClose}
                          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Bookmark size={32} className="text-muted-foreground/30" />
                  </div>
                  <h4 className="font-bold text-lg google-sans">No bookmarks yet</h4>
                  <p className="text-muted-foreground google-sans mt-1">
                    Items you bookmark will appear here for quick access.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border/50 bg-muted/30 text-center">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest google-sans">
                Saved locally in your browser
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
