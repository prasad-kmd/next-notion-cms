import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts, getAuthorBySlug } from "@/lib/content"
import { Container } from "@/components/container"
import { FadeIn } from "@/components/fade-in"
import { Library, ChevronLeft, Bookmark, FileText } from "lucide-react"
import Link from "next/link"
import { TableOfContents } from "@/components/table-of-contents"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { cn } from "@/lib/utils"
import { AuthorProfile } from "@/components/ui/author-profile"

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
    <div className="pt-32 pb-20">
      <Container>
        <div className="flex flex-col xl:flex-row gap-16">
          {/* Left Sidebar: Wiki Navigation */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4">Wiki Explorer</h3>
                <nav className="flex flex-col gap-1">
                  {allWikiPages.map((wiki) => (
                    <Link
                      key={wiki.slug}
                      href={`/wiki/${wiki.slug}`}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        slug === wiki.slug
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <FileText size={14} />
                      <span className="truncate">{wiki.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <FadeIn direction="down">
              <Link
                href="/wiki"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 xl:hidden"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to wiki
              </Link>

              <div className="space-y-4 mb-12">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest">
                  <Library size={14} /> Wiki Page
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                  {page.title}
                </h1>
                <div className="flex items-center gap-2 pt-2 text-muted-foreground text-sm">
                  <Bookmark size={14} /> Last updated: {page.date}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} direction="none">
              <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-border/40 prose-img:rounded-2xl">
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
              </article>
            </FadeIn>
            {page.aiAssisted && <AIContentIndicator />}
          </div>

          {/* Right Sidebar: Table of Contents */}
          <aside className="hidden lg:block w-72 shrink-0 border-l border-border/40 pl-8 h-fit">
            <div className="sticky top-32 space-y-8">
              <TableOfContents headings={page.headings} />
              {author && <AuthorProfile author={author} lastUpdated={page.date} />}
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
