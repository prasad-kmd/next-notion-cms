import { notFound } from "next/navigation";
import { getPostBySlug, getAuthorBySlug } from "@/lib/content";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/fade-in";
import { Calendar, Clock, User, ChevronLeft } from "lucide-react";
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
  const post = await getPostBySlug("quizzes", slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function QuizPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug("quizzes", slug);

  if (!post) {
    notFound();
  }

  const author = post.author ? await getAuthorBySlug(post.author) : null;

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 blog_item img_grad_pm pt-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 relative">
          <article className="flex-1 min-w-0">
            <FadeIn direction="down">
              <Link
                href="/quizzes"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 font-google-sans"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to quizzes
              </Link>

              <header className="mb-12 border-b border-border/40 pb-8">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-tight text-foreground mozilla-headline mb-6">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4">
                  <div className="flex items-center gap-2 font-google-sans">
                    <Calendar size={16} className="text-primary" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2 font-google-sans">
                    <User size={16} className="text-primary" />
                    {author?.name || "Admin"}
                  </div>
                </div>
              </header>
            </FadeIn>

            <FadeIn delay={0.2} direction="none">
              <CodeBlockWrapper>
                <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl font-google-sans">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
              </CodeBlockWrapper>
            </FadeIn>
            {post.aiAssisted && <AIContentIndicator />}
          </article>

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-16 flex flex-col gap-8 max-h-[calc(100vh-140px)]">
              {author && (
                <div className="pb-4 border-b border-border/40">
                  <AuthorProfile author={author} lastUpdated={post.date} />
                </div>
              )}
              <div className="flex-1 flex flex-col min-h-0">
                <TableOfContents headings={post.headings} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
