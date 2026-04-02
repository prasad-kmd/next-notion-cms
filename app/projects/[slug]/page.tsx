import { notFound } from "next/navigation"
import { Calendar, Tag, ChevronLeft, Cpu } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { TableOfContents } from "@/components/table-of-contents"
import { getPostBySlug, getAllPosts } from "@/lib/content"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getAllPosts("projects")
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getPostBySlug("projects", slug)
  if (!project) return {}

  return {
    title: project.title,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getPostBySlug("projects", slug)

  if (!project) {
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
              href="/projects"
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to projects</span>
            </Link>

            {/* Project Header */}
            <header className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-widest">
                <Tag className="h-4 w-4" />
                <span>{project.category}</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl">
                {project.title}
              </h1>
              <p className="max-w-3xl text-xl text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                </div>
                {project.technical && (
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4" />
                    <span>{project.technical}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Content & TOC */}
            <div className="flex flex-col lg:flex-row gap-12 pt-8 border-t border-border/40">
              <div className="flex-1 min-w-0">
                <MarkdownRenderer content={project.content} />
              </div>
              <aside className="lg:w-64">
                <TableOfContents content={project.content} />
              </aside>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
