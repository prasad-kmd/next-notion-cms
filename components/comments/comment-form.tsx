"use client";

import { useState, useRef, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { posthog } from "@/lib/posthog-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TurnstileWidget, type TurnstileWidgetRef } from "./turnstile-widget";

interface CommentFormProps {
  pageId: string;
  onSuccess: (newComment: any) => void;
}

export function CommentForm({ pageId, onSuccess }: CommentFormProps) {
  const { data: session, isPending } = authClient.useSession();
  const [content, setContent] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetRef>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting || honeypot || !turnstileToken) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          pageId, 
          content: content.trim(),
          turnstileToken 
        }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const newComment = await res.json();
      
      // Track comment submission in PostHog
      if (posthog) {
        posthog.capture("comment_submitted", {
          page_id: pageId,
          content_length: content.trim().length,
          author_id: session?.user?.id,
          // Extract info from page if possible, otherwise rely on backend or previous registration
        });
      }

      setContent("");
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      onSuccess(newComment);
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="h-32 w-full animate-pulse bg-muted/20 rounded-2xl border border-border/40" />
    );
  }

  if (!session) {
    return (
      <div className="p-8 rounded-2xl border border-dashed border-border/60 bg-muted/5 flex flex-col items-center text-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/40">
          <Lock className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground mb-1 font-local-inter">
            Sign in to join the discussion
          </h4>
          <p className="text-xs text-muted-foreground font-local-inter">
            Share your thoughts and feedback on this article.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl px-6 font-mozilla-headline">
          <Link href={`/sign-in?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}>
            Sign In
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field for anti-spam */}
      <div className="sr-only" aria-hidden="true">
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="relative group">
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px] rounded-2xl bg-card/50 border-border/40 focus:border-primary/40 focus:ring-primary/10 transition-all resize-none p-4 text-sm font-noto-serif-sinhala"
          disabled={isSubmitting}
        />
        
        {content.trim().length > 0 && (
          <TurnstileWidget 
            ref={turnstileRef}
            onVerify={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
            onError={() => {
              setTurnstileToken(null);
              toast.error("Security verification failed. Please try again.");
            }}
          />
        )}

        <div className="absolute bottom-3 right-3 flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/40 backdrop-blur-sm">
                {session.user.image && (
                    <img src={session.user.image} className="w-4 h-4 rounded-full border border-border/60" alt="" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-roboto">
                    {session.user.name}
                </span>
             </div>
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting || !turnstileToken}
            size="sm"
            className="rounded-xl shadow-lg shadow-primary/20"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground/60 px-2 italic font-local-inter">
        Keep the discussion technical and respectful. Markdown is supported via Notion.
      </p>
    </form>
  );
}
