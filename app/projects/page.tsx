import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { PostCard } from "@/components/post-card"
import { getAllPosts } from "@/lib/content"
import { FadeIn } from "@/components/fade-in"

export const metadata = {
  title: "Projects",
  description: "A showcase of my engineering projects and open-source work.",
}

export default async function ProjectsPage() {
  const projects = await getAllPosts("projects")

  return (
    <>
      <Navbar />
      <main className="flex-1 py-20">
        <Container>
          <FadeIn direction="down" className="flex flex-col space-y-4 mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Projects
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              From web applications to open-source tools, here is a collection of things I've built.
            </p>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <FadeIn key={project.slug} delay={i * 0.1}>
                <PostCard post={project} type="projects" />
              </FadeIn>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
