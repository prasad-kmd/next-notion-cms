"use client"

import React, { useState, useEffect, useCallback } from "react"
import { 
  Rss, 
  ExternalLink, 
  FileText, 
  Calendar,
  Loader2,
  ChevronLeft,
  RefreshCw
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SafeLink } from "@/components/ui/safe-link"

interface FeedItem {
  title: string
  link: string
  pubDate: string
}

export default function FeedsPage() {
  const [posts, setPosts] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      return `${year}/${month}/${day}`
    } catch {
      return dateString
    }
  }

  const fetchFeeds = useCallback(async () => {
    setLoading(true)
    setError(null)
    const rssUrl = "https://api.codetabs.com/v1/proxy?quest=https://prasad-kmd.blogspot.com/feeds/posts/default?alt=rss"
    
    try {
      const response = await fetch(rssUrl)
      if (!response.ok) throw new Error("Failed to fetch RSS feed")
      const rssText = await response.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(rssText, "application/xml")
      const items = xmlDoc.querySelectorAll("item")

      const parsedItems: FeedItem[] = []
      items.forEach((item) => {
        const title = item.querySelector("title")?.textContent || "Untitled"
        const link = item.querySelector("link")?.textContent || "#"
        const pubDate = item.querySelector("pubDate")?.textContent || ""
        parsedItems.push({
          title,
          link,
          pubDate: pubDate ? formatDate(pubDate) : "Unknown Date"
        })
      })

      setPosts(parsedItems)
    } catch (err) {
      console.error("Error fetching RSS feed:", err)
      setError("Error loading posts. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeeds()
  }, [fetchFeeds])

  return (
    <div className="min-h-screen p-6 lg:p-12 img_grad_pm">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
           <Link href="/tools" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ChevronLeft className="w-3 h-3" />
              Back to Tools
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mozilla-headline flex items-center gap-3 text-balance">
                <Rss className="h-10 w-10 text-primary" />
                External Blog Feeds
              </h1>
              <p className="mt-2 text-muted-foreground google-sans">
                Latest updates and posts from my external engineering blog on Blogger.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={fetchFeeds} 
              disabled={loading}
              className="h-10 border-primary/20 bg-primary/5 hover:bg-primary/10"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-destructive border border-destructive/20 mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse font-mono text-sm tracking-widest">FETCHING_DATA...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post, idx) => (
                <Card 
                  key={idx} 
                  className="group border-border bg-card/40 backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <SafeLink 
                      href={post.link} 
                      className="flex items-center gap-4 p-5 hover:bg-primary/[0.03] transition-colors"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold group-hover:text-primary transition-colors truncate google-sans">
                          {post.title}
                        </h2>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.pubDate}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span className="text-primary/70">blogspot.com</span>
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground/30 transition-all group-hover:text-primary group-hover:translate-x-1" />
                    </SafeLink>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border bg-card/20">
                <p className="text-muted-foreground">No posts found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
