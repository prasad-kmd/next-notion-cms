import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getContentByType,
  getContentItem,
  getAuthorBasic,
} from "@/lib/content";
import { siteConfig } from "@/lib/config";
import { Calendar, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { ContentRenderer } from "@/components/content-renderer";
import { BookmarkButton } from "@/components/bookmark-button";
import { ScrollProgress } from "@/components/scroll-progress";
import { RelatedContent } from "@/components/related-content";
import { ArticleSidebar } from "@/components/article-sidebar";
import { AIContentIndicator } from "@/components/ai-content-indicator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentItem("tutorials", slug);

  if (!post) {
    notFound();
  }

  const description =
    post.description || post.content.slice(0, 160).replace(/\*/g, "") + "...";
  const ogImage = `${siteConfig.url}/api/og?title=${encodeURIComponent(
    post.title,
  )}`;
  const postUrl = `${siteConfig.url}/tutorials/${post.slug}`;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: postUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const posts = getContentByType("tutorials");
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getContentItem("tutorials", slug);

  if (!post) {
    notFound();
  }

  const author = post.author ? getAuthorBasic(post.author) : null;

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 tutorials_item img_grad_pm">
      <ScrollProgress />
      <div className="mx-auto max-w-6xl">
        <Link
          href="/tutorials"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground font-local-inter"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tutorials
        </Link>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="flex-1 min-w-0">
            <header className="mb-8 border-b border-border pb-8">
              <h1 className="mb-4 text-4xl font-bold text-balance lg:text-5xl font-google-sans">
                {post.title}
              </h1>
              {post.date && (
                <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground font-local-inter">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString("en-UK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {post.readingTime && (
                      <span className="flex items-center gap-1.5 ml-4 border-l border-border pl-4">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readingTime} min read
                      </span>
                    )}
                  </div>
                  <BookmarkButton
                    key={post.slug}
                    item={{
                      slug: post.slug,
                      title: post.title,
                      date: post.date,
                      type: "tutorials",
                    }}
                  />
                </div>
              )}
            </header>

            <ContentRenderer content={post.content} id={post.slug} />
          </article>

          <ArticleSidebar
            content={post.content}
            author={author}
            lastUpdated={post.date}
          />
        </div>

        <RelatedContent type="tutorials" currentSlug={post.slug} />
      </div>
      {post.aiAssisted && <AIContentIndicator />}
    </div>
  );
}
