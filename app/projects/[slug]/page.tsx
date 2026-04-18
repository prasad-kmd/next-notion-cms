import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContentByType, getContentItem } from "@/lib/content";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ContentRenderer } from "@/components/content-renderer";
import { BookmarkButton } from "@/components/bookmark-button";
import { ScrollProgress } from "@/components/scroll-progress";
import { RelatedContent } from "@/components/related-content";
import { AIContentIndicator } from "@/components/ai-content-indicator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getContentItem("projects", slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export async function generateStaticParams() {
  const posts = await getContentByType("projects");
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getContentItem("projects", slug);

  if (!project) {
    return notFound();
  }

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 projects_item img_grad_pm">
      <ScrollProgress />
      <div className="mx-auto max-w-4xl">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground font-local-inter"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <article>
          <header className="mb-8 border-b border-border pb-8">
            <h1 className="mb-4 text-4xl font-bold text-balance lg:text-5xl font-google-sans">
              {project.title}
            </h1>
            {project.date && (
              <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground font-local-inter">
                <div className="flex items-center gap-2 font-local-inter">
                  <Calendar className="h-4 w-4" />
                  {new Date(project.date).toLocaleDateString("en-UK", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <BookmarkButton
                  key={project.slug}
                  item={{
                    slug: project.slug,
                    title: project.title,
                    date: project.date,
                    type: "projects",
                  }}
                />
              </div>
            )}
          </header>

          <ContentRenderer content={project.content} id={project.slug} />
        </article>

        <RelatedContent type="projects" currentSlug={project.slug} />
      </div>
      {project.aiAssisted && <AIContentIndicator />}
    </div>
  );
}
