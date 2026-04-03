import { notFound } from "next/navigation"
import { getPostBySlug, getAuthorBySlug } from "@/lib/content"
import { Container } from "@/components/container"
import { FadeIn } from "@/components/fade-in"
import { Calendar, Clock, User, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { TableOfContents } from "@/components/table-of-contents"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { AuthorProfile } from "@/components/ui/author-profile"
import { CodeBlockWrapper } from "@/components/code-block-wrapper"

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

  const author = post.author ? await getAuthorBySlug(post.author) : null;

  return (
    <div className="pt-20 pb-20">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 min-w-0 py-8">
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
                {author?.name || "Admin"}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                5 min read
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} direction="none">
          <CodeBlockWrapper>
            <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
          </CodeBlockWrapper>
        </FadeIn>
        {post.aiAssisted && <AIContentIndicator />}
        </div>

        <aside className="hidden lg:block w-72 shrink-0 border-l border-border/40 pl-8">
          <div className="sticky top-32 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-none pr-4 space-y-8 pb-8">
            <TableOfContents headings={post.headings} />
            {author && <AuthorProfile author={author} lastUpdated={post.date} />}
          </div>
        </aside>
        </div>
      </Container>
    </div>
  );
}
