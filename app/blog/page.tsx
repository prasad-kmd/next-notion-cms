import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { PostCard } from "@/components/post-card"
import { getAllPosts } from "@/lib/content"
import { FadeIn } from "@/components/fade-in"

export const metadata = {
  title: "Blog",
  description: "Read my latest thoughts on engineering, technology, and more.",
}

export default async function BlogPage() {
  const posts = await getAllPosts("blog")

  return (
    <>
      <Navbar />
      <main className="flex-1 py-20">
        <Container>
          <FadeIn direction="down" className="flex flex-col space-y-4 mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Blog
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Insights, guides, and thoughts on building modern web applications.
            </p>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 0.1}>
                <PostCard post={post} type="blog" />
              </FadeIn>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
