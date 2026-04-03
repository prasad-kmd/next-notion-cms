import { Container } from "@/components/container"
import { getAllPosts } from "@/lib/content"
import { FadeIn } from "@/components/fade-in"
import { ContentList } from "@/components/content-list"

export const metadata = {
  title: "Blog",
  description: "Read my latest thoughts on engineering, technology, and more.",
}

export default async function BlogPage() {
  const posts = await getAllPosts("blog")

  return (
    <>
      <div className="flex-1 pt-32 pb-20">
        <Container>
          <FadeIn direction="down" className="flex flex-col space-y-4 mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Blog
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Insights, guides, and thoughts on building modern web applications.
            </p>
          </FadeIn>

          <ContentList initialPosts={posts} type="blog" />
        </Container>
      </div>
    </>
  )
}
