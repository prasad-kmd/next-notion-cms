import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/content"
import { Container } from "@/components/container"
import { FadeIn } from "@/components/fade-in"
import { Calendar, Tag, ChevronLeft, ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import { TableOfContents } from "@/components/table-of-contents"

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getPostBySlug("projects", slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPostBySlug("projects", slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="py-20">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 max-w-3xl">
        <FadeIn direction="down">
          <Link
            href="/projects"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to projects
          </Link>

          <div className="space-y-6 mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              {project.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
               {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-6 border-t border-border/40">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {project.date}
              </div>
              <div className="flex items-center gap-2">
                <Tag size={16} />
                {project.category}
              </div>
              <div className="flex gap-4 ml-auto">
                 <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:scale-105">
                   <ExternalLink size={16} /> Live Demo
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium transition-all hover:bg-accent/80">
                   <Github size={16} /> Source Code
                 </button>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} direction="none">
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-pre:bg-card prose-pre:border prose-pre:border-border/40">
            <div dangerouslySetInnerHTML={{ __html: project.content }} />
          </article>
        </FadeIn>
        </div>

        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <TableOfContents headings={project.headings} />
          </div>
        </aside>
        </div>
      </Container>
    </div>
  );
}
