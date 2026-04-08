import type { Metadata } from "next";
import { getContentByType } from "@/lib/content";
import { ContentCard } from "@/components/content-card";

const title = "Blog";
const description =
  "Latest updates, engineering insights, and technical articles from our team.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/blog",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}`,
        width: 1200,
        height: 630,
        alt: description,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`/api/og?title=${encodeURIComponent(title)}`],
  },
};

export default function BlogPage() {
  const blogPosts = getContentByType("blog");

  return (
    <div className="min-h-screen py-12 blog_page img_grad_pm">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-14">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline tracking-tight sm:text-6xl text-foreground">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-google-sans max-w-2xl border-l-4 border-primary pl-4">
            {description}
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-inner">
            <p className="text-muted-foreground font-local-inter">
              No blog posts yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {blogPosts.map((post) => (
              <ContentCard key={post.slug} post={post} basePath="/blog" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
