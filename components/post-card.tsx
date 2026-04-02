import Link from "next/link"
import { Calendar, Tag, ChevronRight, Cpu } from "lucide-react"
import { PostMetadata } from "@/types"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: PostMetadata
  type: "blog" | "projects" | "wiki"
  className?: string
}

export function PostCard({ post, type, className }: PostCardProps) {
  const href = `/${type}/${post.slug}`

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col space-y-4 rounded-xl border border-border/40 bg-card/30 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-card/50 hover:shadow-xl dark:bg-card/20 dark:hover:bg-card/30 glass-card",
        className
      )}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-medium text-primary uppercase tracking-wider">
            <Tag className="h-3 w-3" />
            <span>{post.category}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary md:text-2xl">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground md:text-base">
          {post.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2 text-xs font-medium text-muted-foreground">
          {post.technical && (
            <div className="flex items-center space-x-1 border border-border/40 rounded-full px-2 py-1 bg-secondary/30">
              <Cpu className="h-3 w-3" />
              <span>{post.technical.split(",")[0]}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 text-sm font-semibold text-primary transition-all duration-300 group-hover:translate-x-1">
          <span>Read more</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      {post.aiAssisted && (
        <div className="absolute top-2 right-2 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent uppercase tracking-tighter">
          AI Assisted
        </div>
      )}
    </Link>
  )
}
