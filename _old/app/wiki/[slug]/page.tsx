import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, getAuthorBySlug } from "@/lib/content";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/fade-in";
import { Library, ChevronLeft, Bookmark, FileText } from "lucide-react";
import Link from "next/link";
import { TableOfContents } from "@/components/table-of-contents";
import { AIContentIndicator } from "@/components/ai-content-indicator";
import { cn } from "@/lib/utils";
import { AuthorProfile } from "@/components/ui/author-profile";
import { CodeBlockWrapper } from "@/components/code-block-wrapper";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await getPostBySlug("wiki", slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function WikiDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPostBySlug("wiki", slug);
  const allWikiPages = await getAllPosts("wiki");

  if (!page) {
    notFound();
  }

  const author = page.author ? await getAuthorBySlug(page.author) : null;

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 wiki_item img_grad_pm pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col xl:flex-row gap-12 relative">
          {/* Left Sidebar: Wiki Navigation */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-32 space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60 mb-6 px-3 google-sans">
                  Wiki Explorer
                </h3>
                <nav className="flex flex-col gap-1">
                  {allWikiPages.map((wiki) => (
                    <Link
                      key={wiki.slug}
                      href={`/wiki/${wiki.slug}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group mozilla-text",
                        slug === wiki.slug
                          ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-sm shadow-primary/5"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent",
                      )}
                    >
                      <FileText
                        size={16}
                        className={cn(
                          "transition-colors",
                          slug === wiki.slug
                            ? "text-primary"
                            : "text-muted-foreground/50 group-hover:text-primary",
                        )}
                      />
                      <span className="truncate">{wiki.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <article className="flex-1 min-w-0">
            <FadeIn direction="down">
              <Link
                href="/wiki"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 xl:hidden font-google-sans"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to wiki
              </Link>

              <header className="mb-12 border-b border-border/40 pb-8">
                <div className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-[0.2em] mb-4 google-sans">
                  <Library size={14} /> Wiki Page
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-tight text-foreground mozilla-headline mb-6">
                  {page.title}
                </h1>
                <div className="flex items-center gap-3 text-muted-foreground text-sm font-google-sans">
                  <Bookmark size={14} className="text-primary" />
                  <span>Last updated: {page.date}</span>
                </div>
              </header>
            </FadeIn>

            <FadeIn delay={0.2} direction="none">
              <CodeBlockWrapper>
                <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl font-google-sans">
                  <div dangerouslySetInnerHTML={{ __html: page.content }} />
                </article>
              </CodeBlockWrapper>
            </FadeIn>
            {page.aiAssisted && <AIContentIndicator />}
          </article>

          {/* Right Sidebar: Table of Contents */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32 flex flex-col gap-8 max-h-[calc(100vh-160px)]">
              {author && (
                <div className="pb-4 border-b border-border/40">
                  <AuthorProfile author={author} lastUpdated={page.date} />
                </div>
              )}
              <div className="flex-1 flex flex-col min-h-0">
                <TableOfContents headings={page.headings} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
