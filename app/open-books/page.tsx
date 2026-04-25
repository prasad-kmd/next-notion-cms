"use client"

import React, { useState } from "react"
import { 
  Search, 
  ExternalLink, 
  Library, 
  Loader2,
  ChevronLeft,
  BookOpen,
  User,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { SafeLink } from "@/components/ui/safe-link"

interface Book {
  key: string
  title: string
  author_name?: string[]
  publish_date?: string[]
  cover_i?: number
}

export default function OpenBooksPage() {
  const [query, setQuery] = useState<string>("")
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const searchBooks = async (searchTerm: string) => {
    if (!searchTerm.trim()) return
    
    setLoading(true)
    setError(null)
    const baseUrl = "https://openlibrary.org/search.json?q="
    const resultsPerPage = 20
    const url = `${baseUrl}${encodeURIComponent(searchTerm)}&limit=${resultsPerPage}`
    
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch from Open Library")
      const data = await response.json()

      if (data.numFound === 0) {
        setBooks([])
      } else {
        setBooks(data.docs)
      }
    } catch (err) {
      console.error("Error searching Open Library:", err)
      setError("Error fetching search results. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchBooks(query)
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-12 img_grad_pm">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
           <Link href="/tools" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ChevronLeft className="w-3 h-3" />
              Back to Tools
          </Link>
          <h1 className="text-4xl font-bold mozilla-headline flex items-center gap-3">
            <Library className="h-10 w-10 text-primary" />
            Open Books Library
          </h1>
          <p className="mt-2 text-muted-foreground google-sans max-w-2xl">
            Discover millions of books, manuscripts, and other digital resources from the Open Library database.
          </p>
        </div>

        <div className="mb-12 flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, or ISBN..."
              className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-border"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <Button onClick={() => searchBooks(query)} disabled={loading} className="h-12 px-8 shadow-lg shadow-primary/20">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
            Find Books
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
            <p className="text-muted-foreground animate-pulse font-mono text-sm tracking-widest">BROWSING_DIGITAL_ARCHIVES...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.length > 0 ? (
              books.map((book) => {
                const title = book.title
                const author = book.author_name ? book.author_name[0] : "Unknown Author"
                const publishDate = book.publish_date ? book.publish_date[0] : "Unknown Date"
                const coverUrl = book.cover_i 
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
                  : "https://placehold.co/720x480?text=No+Cover"

                return (
                  <Card key={book.key} className="group flex flex-col overflow-hidden border-border bg-card/40 backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <Image
                        src={imageError[book.key] ? "https://placehold.co/720x480?text=Cover+Not+Found" : coverUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => {
                          setImageError(prev => ({ ...prev, [book.key]: true }));
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                      <div className="absolute bottom-4 left-4 right-4">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/80 bg-primary/20 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                            Digital Resource
                         </span>
                      </div>
                    </div>
                    <CardHeader className="p-4 flex-1">
                      <CardTitle className="line-clamp-2 text-base font-bold google-sans group-hover:text-primary transition-colors min-h-[3rem]">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3 text-primary/70" />
                        <span className="truncate">{author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 text-primary/70" />
                        <span>{publishDate}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0 border-t border-border">
                      <Button 
                        variant="ghost" 
                        className="w-full rounded-none h-12 gap-2 hover:bg-primary hover:text-primary-foreground transition-all group/btn font-bold"
                        asChild
                      >
                        <SafeLink href={`https://openlibrary.org${book.key}`}>
                          View on Open Library
                          <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </SafeLink>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })
            ) : query && !loading ? (
              <div className="col-span-full flex h-64 flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border bg-card/20 backdrop-blur-sm">
                <BookOpen className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-bold google-sans mb-1">No books found</h3>
                <p className="text-muted-foreground">Try searching for a different title or author.</p>
              </div>
            ) : (
              <div className="col-span-full flex h-96 flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted/30 p-8 mb-6 border border-border/50">
                  <Library className="h-16 w-16 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold google-sans mb-2 text-muted-foreground/80">Search Open Library</h3>
                <p className="text-muted-foreground max-w-sm">
                  Access the world&apos;s most comprehensive open library and find your next technical resource.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
