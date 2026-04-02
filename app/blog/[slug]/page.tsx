import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/content"
import { Container } from "@/components/container"
import { FadeIn } from "@/components/fade-in"
import { Calendar, Clock, User, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { TableOfContents } from "@/components/table-of-contents"
import { AIContentIndicator } from "@/components/ai-content-indicator"

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug("blog", slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug("blog", slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-20">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 max-w-3xl">
        <FadeIn direction="down">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to blog
          </Link>

          <div className="space-y-4 mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight text-foreground">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border/40">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                PrasadM
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                5 min read
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} direction="none">
          <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-border/40 prose-img:rounded-2xl">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </FadeIn>
        {post.aiAssisted && <AIContentIndicator />}
        </div>

        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <TableOfContents headings={post.headings} />
          </div>
        </aside>
        </div>
      </Container>
    </div>
  );
}
