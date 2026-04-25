"use client";

import { useState } from "react";
import { CommentList } from "./comment-list";
import { CommentForm } from "./comment-form";
import { MessageSquare, ChevronDown, ChevronUp, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CommentsSectionProps {
  pageId?: string;
  slug: string;
}

export function CommentsSection({ pageId, slug }: CommentsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newComments, setNewComments] = useState<any[]>([]);
  const [commentCount, setCommentCount] = useState<number | null>(null);

  if (!pageId) return null;

  return (
    <section id="comments" className="mt-16 pt-16 border-t border-border/40 relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />

      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-google-sans">Discussion</h3>
              <p className="text-xs text-muted-foreground font-medium font-local-inter">Native Notion Comments System</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all font-local-inter",
              isOpen 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "bg-muted/30 text-muted-foreground border border-border/40 hover:bg-muted/50"
            )}
          >
            {isOpen ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                Hide Comments
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                Show Comments {commentCount !== null && commentCount > 0 && `(${commentCount})`}
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-12"
            >
              <div className="max-w-2xl">
                <CommentForm 
                    pageId={pageId} 
                    onSuccess={(comment) => setNewComments(prev => [comment, ...prev])} 
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border/40" />
                    <span className="text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-2 font-local-inter">
                        <Database className="h-3 w-3" />
                        Recent Comments
                    </span>
                    <div className="h-px flex-1 bg-border/40" />
                </div>
                <CommentList 
                    pageId={pageId} 
                    newComments={newComments} 
                    onCountUpdate={setCommentCount}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
