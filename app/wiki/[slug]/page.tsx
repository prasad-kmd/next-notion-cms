import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/content"
import { Container } from "@/components/container"
import { FadeIn } from "@/components/fade-in"
import { Library, ChevronLeft, Bookmark } from "lucide-react"
import Link from "next/link"

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

  if (!page) {
    notFound();
  }

  return (
    <div className="py-20">
      <Container variant="narrow">
        <FadeIn direction="down">
          <Link
            href="/wiki"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
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
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-pre:bg-card prose-pre:border prose-pre:border-border/40">
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </article>
        </FadeIn>
      </Container>
    </div>
  );
}
