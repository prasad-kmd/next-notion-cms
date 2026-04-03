import { Container } from "@/components/container"
import { getAllPosts } from "@/lib/content"
import { FadeIn } from "@/components/fade-in"
import { ContentList } from "@/components/content-list"

export const metadata = {
  title: "Wiki",
  description: "A digital garden for technical documentation and knowledge sharing.",
}

export default async function WikiPage() {
  const pages = await getAllPosts("wiki")

  return (
    <>
      <div className="flex-1 pt-32 pb-20">
        <Container>
          <FadeIn direction="down" className="flex flex-col space-y-4 mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Wiki
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Technical documentation, best practices, and knowledge summaries.
            </p>
          </FadeIn>

          <ContentList initialPosts={pages} type="wiki" />
        </Container>
      </div>
    </>
  )
}
