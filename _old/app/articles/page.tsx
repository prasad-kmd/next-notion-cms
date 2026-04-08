import { Container } from "@/components/container";
import { getAllPosts } from "@/lib/content";
import { FadeIn } from "@/components/fade-in";
import { ContentList } from "@/components/content-list";

export const metadata = {
  title: "Articles",
  description: "Read my latest technical articles.",
};

export default async function ArticlesPage() {
  const posts = await getAllPosts("articles");

  return (
    <div className="min-h-screen px-6 py-12 lg:px-6 blog_page img_grad_pm pt-12">
      <div className="mx-auto max-w-6xl">
        <FadeIn direction="down" className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline tracking-tight sm:text-5xl lg:text-6xl text-foreground font-amoria">
            Articles
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-google-sans max-w-2xl">
            Deep dives into engineering concepts, tutorials, and technical guides.
          </p>
        </FadeIn>

        <ContentList initialPosts={posts} type="articles" />
      </div>
    </div>
  );
}
