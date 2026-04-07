import { Container } from "@/components/container";
import { getAllPosts } from "@/lib/content";
import { FadeIn } from "@/components/fade-in";
import { ContentList } from "@/components/content-list";

export const metadata = {
  title: "Blog",
  description: "Read my latest thoughts on engineering, technology, and more.",
};

export default async function BlogPage() {
  const posts = await getAllPosts("blog");

  return (
    <div className="min-h-screen px-6 py-12 lg:px-6 blog_page img_grad_pm pt-12">
      <div className="mx-auto max-w-6xl">
        <FadeIn direction="down" className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-google-sans max-w-2xl">
            Insights, guides, and thoughts on building modern web applications.
            Each post explores practical solutions combining engineering
            expertise.
          </p>
        </FadeIn>

        <ContentList initialPosts={posts} type="blog" />
      </div>
    </div>
  );
}
