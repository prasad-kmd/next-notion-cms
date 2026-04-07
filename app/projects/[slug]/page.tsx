import { notFound } from "next/navigation";
import { getPostBySlug, getAuthorBySlug } from "@/lib/content";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/fade-in";
import { Calendar, Tag, ChevronLeft, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { TableOfContents } from "@/components/table-of-contents";
import { AIContentIndicator } from "@/components/ai-content-indicator";
import { AuthorProfile } from "@/components/ui/author-profile";
import { CodeBlockWrapper } from "@/components/code-block-wrapper";

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

  const author = project.author ? await getAuthorBySlug(project.author) : null;

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 projects_item img_grad_pm pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 relative">
          <article className="flex-1 min-w-0">
            <FadeIn direction="down">
              <Link
                href="/projects"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 font-google-sans"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to projects
              </Link>

              <header className="mb-12 border-b border-border/40 pb-8">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-tight text-foreground mozilla-headline mb-6">
                  {project.title}
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed font-google-sans mb-8">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4">
                  <div className="flex items-center gap-2 font-google-sans">
                    <Calendar size={16} className="text-primary" />
                    {project.date}
                  </div>
                  <div className="flex items-center gap-2 font-google-sans uppercase tracking-wider text-[11px] font-bold">
                    <Tag size={14} className="text-primary" />
                    {project.category}
                  </div>
                  <div className="flex gap-4 ml-auto">
                    <Link
                      href="#"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20 google-sans"
                    >
                      <ExternalLink size={14} /> Live Demo
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-bold transition-all hover:bg-muted/80 border border-border/50 google-sans"
                    >
                      <Github size={14} /> Source
                    </Link>
                  </div>
                </div>
              </header>
            </FadeIn>

            <FadeIn delay={0.2} direction="none">
              <CodeBlockWrapper>
                <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl font-google-sans">
                  <div dangerouslySetInnerHTML={{ __html: project.content }} />
                </article>
              </CodeBlockWrapper>
            </FadeIn>
            {project.aiAssisted && <AIContentIndicator />}
          </article>

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32 flex flex-col gap-8 max-h-[calc(100vh-160px)]">
              {author && (
                <div className="pb-4 border-b border-border/40">
                  <AuthorProfile author={author} lastUpdated={project.date} />
                </div>
              )}
              <div className="flex-1 flex flex-col min-h-0">
                <TableOfContents headings={project.headings} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
