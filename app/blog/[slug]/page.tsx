import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getContentByType,
  getContentItem,
  getAuthorBasic,
} from "@/lib/content";
import { Calendar, Clock } from "lucide-react";
// import Link from "next/link";
import { ContentRenderer } from "@/components/content-renderer";
import { BookmarkButton } from "@/components/bookmark-button";
import { PrintButton } from "@/components/content/PrintButton";
import { PrintHeaderFooter } from "@/components/content/PrintHeaderFooter";
import { ScrollProgress } from "@/components/scroll-progress";
import { RelatedContent } from "@/components/related-content";
import { ArticleSidebar } from "@/components/article-sidebar";
import { AIContentIndicator } from "@/components/ai-content-indicator";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  JsonLd,
  getContentSchema,
  getBreadcrumbSchema,
} from "@/components/json-ld";
import { CommentsSection } from "@/components/comments/comments-section";
import { CommentScrollButton } from "@/components/comment-scroll-button";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { ViewCounter } from "@/components/content/ViewCounter";
import { ContentArea } from "@/components/accessibility/ContentArea";

export async function generateStaticParams() {
  const blogPosts = await getContentByType("blog");
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentItem("blog", slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getContentItem("blog", slug);

  if (!post) {
    notFound();
  }

  const author = post.author ? await getAuthorBasic(post.author) : null;

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 blog_item img_grad_pm">
      <PageViewTracker
        contentType="blog"
        slug={post.slug}
        title={post.title}
        authorId={post.author}
      />
      <JsonLd
        data={getContentSchema({ ...post, authorName: author?.name }, "blog")}
      />
      <JsonLd
        data={getBreadcrumbSchema([
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ])}
      />
      <ScrollProgress />
      <div className="mx-auto max-w-6xl">
          <div data-print-hide="true">
            <Breadcrumbs
              items={[
                { label: "Blog", href: "/blog" },
                { label: post.title, href: `/blog/${post.slug}`, active: true },
              ]}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
          <article className="flex-1 min-w-0">
            <header className="mb-8 border-b border-border pb-8">
              <h1 className="mb-4 text-4xl font-bold text-balance lg:text-5xl font-google-sans">
                {post.title}
              </h1>
              {post.date && (
                <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2 font-google-sans">
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
                    <span className="flex items-center gap-1.5 ml-4 border-l border-border pl-4">
                      <ViewCounter slug={post.slug} contentType="blog" />
                    </span>
                  </div>
                  <div className="flex items-center gap-2" data-print-hide="true">
                    <CommentScrollButton />
                    <PrintButton
                      postTitle={post.title}
                      authorName={author?.name || "PMEngineerLK"}
                      publishDate={post.date || ""}
                    />
                    <BookmarkButton
                      key={post.slug}
                      item={{
                        slug: post.slug,
                        title: post.title,
                        date: post.date,
                        type: "blog",
                      }}
                    />
                  </div>
                </div>
              )}
            </header>

            <ContentArea>
              <div data-print-content="true">
                <PrintHeaderFooter
                  title={post.title}
                  author={author?.name}
                  date={post.date}
                />
                <ContentRenderer content={post.content} id={post.slug} />
              </div>
            </ContentArea>
          </article>

          <ArticleSidebar
            content={post.content}
            author={author}
            lastUpdated={post.date}
          />
        </div>

        <CommentsSection pageId={post.id} slug={post.slug} />

        <RelatedContent type="blog" currentSlug={post.slug} />
      </div>
      {post.aiAssisted && <AIContentIndicator />}
    </div>
  );
}
