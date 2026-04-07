import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Tag,
  User,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { PostMetadata } from "@/lib/content";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostMetadata;
  type: "blog" | "projects" | "wiki";
}

export function PostCard({ post, type }: PostCardProps) {
  const href = `/${type}/${post.slug}`;

  const borderColor = post.final ? "border-green-500/70" : "border-border/50";

  const hoverBorderColor = post.final
    ? "group-hover:border-green-500"
    : "group-hover:border-primary/50";

  return (
    <Link href={href} className="group block h-full">
      <div
        className={cn(
          "relative flex flex-col h-full overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5",
          borderColor,
          hoverBorderColor,
        )}
        style={{
          backgroundImage: `var(--item-gradient)`,
          backgroundBlendMode: "overlay",
          backgroundOrigin: "border-box",
          backgroundPosition: "right",
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-col flex-1 p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {post.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-wider google-sans"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {post.aiAssisted && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 uppercase tracking-tight">
                  <Sparkles size={10} />
                  <span>AI</span>
                </div>
              )}
              {post.final && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-tight">
                  <CheckCircle2 size={10} />
                  <span>Final</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 google-sans">
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
                <span className="flex items-center gap-1.5 font-google-sans">
                  <Calendar size={12} />
                  {post.date}
                </span>
                {post.category && (
                  <span className="flex items-center gap-1.5 hidden sm:flex font-google-sans">
                    <Tag size={12} />
                    {post.category}
                  </span>
                )}
              </div>
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
