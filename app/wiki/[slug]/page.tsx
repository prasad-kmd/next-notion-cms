import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getContentByType,
  getContentItem,
  getAuthorBasic,
} from "@/lib/content";
import { ArrowLeft, Clock, BookOpen, Hash } from "lucide-react";
import Link from "next/link";
import { ContentRenderer } from "@/components/content-renderer";
import { BookmarkButton } from "@/components/bookmark-button";
import { ScrollProgress } from "@/components/scroll-progress";
import { RelatedContent } from "@/components/related-content";
import { ArticleSidebar } from "@/components/article-sidebar";
import { AIContentIndicator } from "@/components/ai-content-indicator";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CommentsSection } from "@/components/comments/comments-section";
import { CommentScrollButton } from "@/components/comment-scroll-button";

export async function generateStaticParams() {
  const entries = await getContentByType("wiki");
  return entries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getContentItem("wiki", slug);

  if (!entry) {
    return {};
  }

  return {
    title: `${entry.title} | Engineering Wiki`,
    description: entry.description,
  };
}

export default async function WikiEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getContentItem("wiki", slug);

  if (!entry) {
    notFound();
  }

  const author = entry.author ? await getAuthorBasic(entry.author) : null;

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 wiki_item img_grad_pm">
      <ScrollProgress />
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs 
          items={[
            { label: "Wiki", href: "/wiki" },
            { label: entry.title, href: `/wiki/${entry.slug}`, active: true }
          ]} 
        />

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="flex-1 min-w-0">
            <header className="mb-8 border-b border-border pb-8">
              <div className="flex items-center gap-2 text-primary mb-4">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-widest font-local-inter">
                  Wiki Reference
                </span>
              </div>
              <h1 className="mb-4 text-4xl font-bold text-balance lg:text-5xl font-google-sans">
                {entry.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground font-local-inter">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary/60" />
                    <span className="text-sm font-medium font-local-jetbrains-mono">
                      {entry.technical || "General Engineering"}
                    </span>
                  </div>
                  {entry.readingTime && (
                    <span className="flex items-center gap-1.5 border-l border-border pl-4 font-local-inter">
                      <Clock className="h-3.5 w-3.5" />
                      {entry.readingTime} min read
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <CommentScrollButton />
                  <BookmarkButton
                    key={entry.slug}
                    item={{
                      slug: entry.slug,
                      title: entry.title,
                      type: "wiki",
                    }}
                  />
                </div>
              </div>
            </header>

            <ContentRenderer content={entry.content} id={entry.slug} />
          </article>

          <ArticleSidebar content={entry.content} author={author} />
        </div>

        <CommentsSection pageId={entry.id} slug={entry.slug} />

        <RelatedContent type="wiki" currentSlug={entry.slug} />
      </div>
      {entry.aiAssisted && <AIContentIndicator />}
    </div>
  );
}
