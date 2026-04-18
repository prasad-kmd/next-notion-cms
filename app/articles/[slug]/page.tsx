import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getContentByType,
  getContentItem,
  getAuthorBasic,
} from "@/lib/content";
import { Calendar, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { ContentRenderer } from "@/components/content-renderer";
import { BookmarkButton } from "@/components/bookmark-button";
import { ScrollProgress } from "@/components/scroll-progress";
import { RelatedContent } from "@/components/related-content";
import { ArticleSidebar } from "@/components/article-sidebar";
import { AIContentIndicator } from "@/components/ai-content-indicator";

export async function generateStaticParams() {
  const entries = await getContentByType("articles");
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
  const entry = await getContentItem("articles", slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title,
    description: entry.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getContentItem("articles", slug);

  if (!entry) {
    notFound();
  }

  const author = entry.author ? await getAuthorBasic(entry.author) : null;

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 articles_item img_grad_pm">
      <ScrollProgress />
      <div className="mx-auto max-w-6xl">
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground local-inter"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Link>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="flex-1 min-w-0">
            <header className="mb-8 border-b border-border pb-8">
              <h1 className="mb-4 text-4xl font-bold text-balance lg:text-5xl google-sans">
                {entry.title}
              </h1>
              {entry.date && (
                <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2 google-sans">
                    <Calendar className="h-4 w-4" />
                    {new Date(entry.date).toLocaleDateString("en-UK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {entry.readingTime && (
                      <span className="flex items-center gap-1.5 ml-4 border-l border-border pl-4">
                        <Clock className="h-3.5 w-3.5" />
                        {entry.readingTime} min read
                      </span>
                    )}
                  </div>
                  <BookmarkButton
                    key={entry.slug}
                    item={{
                      slug: entry.slug,
                      title: entry.title,
                      date: entry.date,
                      type: "articles",
                    }}
                  />
                </div>
              )}
            </header>

            <ContentRenderer content={entry.content} id={entry.slug} />
          </article>

          <ArticleSidebar
            content={entry.content}
            author={author}
            lastUpdated={entry.date}
          />
        </div>

        <RelatedContent type="articles" currentSlug={entry.slug} />
      </div>
      {entry.aiAssisted && <AIContentIndicator />}
    </div>
  );
}
