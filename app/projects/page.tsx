import { Container } from "@/components/container"
import { getAllPosts } from "@/lib/content"
import { FadeIn } from "@/components/fade-in"
import { ContentList } from "@/components/content-list"

export const metadata = {
  title: "Projects",
  description: "A collection of my work, from web applications to open-source tools.",
}

export default async function ProjectsPage() {
  const projects = await getAllPosts("projects")

  return (
    <>
      <div className="flex-1 pt-32 pb-20">
        <Container>
          <FadeIn direction="down" className="flex flex-col space-y-4 mb-12 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Projects
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Technical solutions, innovative tools, and architectural explorations.
            </p>
          </FadeIn>

          <ContentList initialPosts={projects} type="projects" />
        </Container>
      </div>
    </>
  )
}
