import { notFound } from "next/navigation"
import { Calendar, Tag, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { getPostBySlug, getAllPosts } from "@/lib/content"

interface WikiPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const notes = await getAllPosts("wiki")
  return notes.map((note) => ({
    slug: note.slug,
  }))
}

export async function generateMetadata({ params }: WikiPageProps) {
  const { slug } = await params
  const note = await getPostBySlug("wiki", slug)
  if (!note) return {}

  return {
    title: note.title,
    description: note.description,
  }
}

export default async function WikiDetailPage({ params }: WikiPageProps) {
  const { slug } = await params
  const note = await getPostBySlug("wiki", slug)

  if (!note) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 lg:py-20">
        <Container>
          <div className="flex flex-col space-y-8">
            {/* Navigation & Back button */}
            <Link
              href="/wiki"
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to wiki</span>
            </Link>

            {/* Header */}
            <header className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-widest">
                <Tag className="h-4 w-4" />
                <span>{note.category}</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl">
                {note.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Last updated: {new Date(note.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="pt-8 border-t border-border/40 max-w-4xl mx-auto w-full">
              <MarkdownRenderer content={note.content} />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
