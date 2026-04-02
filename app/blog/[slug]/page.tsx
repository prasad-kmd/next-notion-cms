import { notFound } from "next/navigation"
import { Calendar, Tag, User, Clock, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { TableOfContents } from "@/components/table-of-contents"
import { getPostBySlug, getAllPosts } from "@/lib/content"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts("blog")
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug("blog", slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug("blog", slug)

  if (!post) {
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
              href="/blog"
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to blog</span>
            </Link>

            {/* Post Header */}
            <header className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-widest">
                <Tag className="h-4 w-4" />
                <span>{post.category}</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl">
                {post.title}
              </h1>
              <p className="max-w-3xl text-xl text-muted-foreground leading-relaxed">
                {post.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </div>
                {post.aiAssisted && (
                  <div className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent uppercase tracking-tighter">
                    AI Assisted
                  </div>
                )}
              </div>
            </header>

            {/* Post Content & TOC */}
            <div className="flex flex-col lg:flex-row gap-12 pt-8 border-t border-border/40">
              <div className="flex-1 min-w-0">
                <MarkdownRenderer content={post.content} />
              </div>
              <aside className="lg:w-64">
                <TableOfContents content={post.content} />
              </aside>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
