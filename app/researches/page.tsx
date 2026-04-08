"use client"

import React, { useState } from "react"
import { 
  Search, 
  ExternalLink, 
  BookMarked, 
  Loader2,
  ChevronLeft,
  FlaskConical,
  FileText
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SafeLink } from "@/components/ui/safe-link"

interface ResearchEntry {
  title: string
  summary: string
  link: string
  id: string
  published: string
}

export default function ResearchesPage() {
  const [query, setQuery] = useState<string>("")
  const [results, setResults] = useState<ResearchEntry[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const searchArXiv = async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setError(null)
    const url = `https://api.codetabs.com/v1/proxy?quest=https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(searchQuery)}`
    
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch from arXiv")
      const data = await response.text()
      
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(data, "application/xml")
      const entries = xmlDoc.querySelectorAll("entry")

      if (entries.length === 0) {
        setResults([])
      } else {
        const parsedEntries: ResearchEntry[] = []
        entries.forEach((entry) => {
          const title = entry.querySelector("title")?.textContent || "Untitled"
          const summary = entry.querySelector("summary")?.textContent?.trim().substring(0, 200) + "..." || ""
          const link = entry.querySelector("id")?.textContent || "#"
          const published = entry.querySelector("published")?.textContent || ""
          parsedEntries.push({
            title,
            summary,
            link,
            id: link,
            published: published ? new Date(published).toLocaleDateString() : "Unknown Date"
          })
        })
        setResults(parsedEntries)
      }
    } catch (err) {
      console.error("Error searching arXiv:", err)
      setError("Error searching for researches. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchArXiv(query)
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-12 img_grad_pm">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
           <Link href="/tools" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ChevronLeft className="w-3 h-3" />
              Back to Tools
          </Link>
          <h1 className="text-4xl font-bold mozilla-headline flex items-center gap-3">
            <FlaskConical className="h-10 w-10 text-primary" />
            Engineering Researches
          </h1>
          <p className="mt-2 text-muted-foreground google-sans max-w-2xl">
            Access and search through the open-access archive for millions of scholarly articles in the fields of physics, mathematics, computer science, and engineering.
          </p>
        </div>

        <div className="mb-12 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by topic, author, or keyword (e.g., 'mechatronics')..."
              className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-border"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <Button onClick={() => searchArXiv(query)} disabled={loading} className="h-12 px-8 shadow-lg shadow-primary/20">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
            Search
          </Button>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-destructive border border-destructive/20 mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse font-mono text-sm tracking-widest">QUERYING_ARXIV_DATABASE...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.length > 0 ? (
              results.map((entry, idx) => (
                <Card 
                  key={idx} 
                  className="group border-border bg-card/40 backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                            Research Paper
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            Published: {entry.published}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold group-hover:text-primary transition-colors mb-3 google-sans leading-tight">
                          {entry.title}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed local-inter mb-4">
                          {entry.summary}
                        </p>
                        <div className="flex items-center gap-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 h-9 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
                            asChild
                          >
                            <SafeLink href={entry.link}>
                              Read Full Paper
                              <ExternalLink className="h-4 w-4" />
                            </SafeLink>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : query && !loading ? (
              <div className="flex h-64 flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border bg-card/20 backdrop-blur-sm">
                <BookMarked className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-bold google-sans mb-1">No results found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or keywords.</p>
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted/30 p-8 mb-6 border border-border/50">
                  <Search className="h-16 w-16 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold google-sans mb-2 text-muted-foreground/80">Start Your Research</h3>
                <p className="text-muted-foreground max-w-sm">
                  Search millions of research papers across various engineering and scientific disciplines.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
