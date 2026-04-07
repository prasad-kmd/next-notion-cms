import { Container } from "@/components/container";
import { getAllPosts } from "@/lib/content";
import { FadeIn } from "@/components/fade-in";
import { ContentList } from "@/components/content-list";

export const metadata = {
  title: "Wiki",
  description:
    "A digital garden for technical documentation and knowledge sharing.",
};

export default async function WikiPage() {
  const pages = await getAllPosts("wiki");

  return (
    <div className="min-h-screen px-6 py-6 lg:px-8 wiki_page img_grad_pm pt-12">
      <div className="mx-auto max-w-6xl">
        <FadeIn direction="down" className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline tracking-tight sm:text-5xl lg:text-6xl text-foreground font-amoria">
            Wiki
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-google-sans max-w-2xl">
            Technical documentation, best practices, and knowledge summaries. A
            digital garden for technical documentation and knowledge sharing.
          </p>
        </FadeIn>

        <ContentList initialPosts={pages} type="wiki" />
      </div>
    </div>
  );
}
