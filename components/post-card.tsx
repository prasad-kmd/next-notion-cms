import Link from "next/link";
import { ArrowRight, Calendar, Tag, User, Sparkles, CheckCircle2 } from "lucide-react";
import { PostMetadata } from "@/lib/content";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostMetadata;
  type: "blog" | "projects" | "wiki";
}

export function PostCard({ post, type }: PostCardProps) {
  const href = `/${type}/${post.slug}`;

  return (
    <Link href={href} className="group block h-full">
      <div className="relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/50 bg-card/40 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 glass-card">
        {/* Card Header Decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex flex-col flex-1 p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
             <div className="flex flex-wrap gap-2">
                {post.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
             </div>
             <div className="flex items-center gap-1.5">
                {post.aiAssisted && <Sparkles size={14} className="text-amber-400" />}
                {post.final && <CheckCircle2 size={14} className="text-emerald-400" />}
             </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {post.description}
            </p>
          </div>

          <div className="mt-auto pt-4 flex flex-col space-y-4">
            {post.technical && (
              <div className="text-[11px] font-mono text-muted-foreground/80 line-clamp-1 border-t border-border/20 pt-4 italic">
                {post.technical}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-muted-foreground gap-3">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {post.date}
                </span>
                {post.category && (
                   <span className="flex items-center gap-1.5 hidden sm:flex">
                    <Tag size={12} />
                    {post.category}
                  </span>
                )}
              </div>
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
