"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { PostMetadata, PostType } from "@/lib/content"
import { PostCard } from "./post-card"
import { FadeIn } from "./fade-in"
import { cn } from "@/lib/utils"

interface ContentListProps {
  initialPosts: PostMetadata[]
  type: PostType
}

export function ContentList({ initialPosts, type }: ContentListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(
    new Set(initialPosts.flatMap((post) => post.tags || []))
  ).sort()

  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || (post.tags || []).includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-6">
        <div className="relative group max-w-md">
          <div className="absolute inset-0 bg-primary/5 rounded-xl blur-lg group-focus-within:bg-primary/10 transition-all" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={`Search in ${type}...`}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border/50 bg-background/50 backdrop-blur-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all google-sans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2 google-sans">
            Filter by Tags:
          </p>
          <button
            onClick={() => setSelectedTag(null)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border google-sans",
              !selectedTag
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border google-sans",
                selectedTag === tag
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                  : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.05}>
              <PostCard post={post} type={type} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">No content found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
