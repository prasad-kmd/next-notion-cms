import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { PostCard } from "@/components/post-card"
import { getAllPosts } from "@/lib/content"
import { FadeIn } from "@/components/fade-in"

export const metadata = {
  title: "Wiki",
  description: "A technical wiki containing snippets, guides, and notes.",
}

export default async function WikiPage() {
  const notes = await getAllPosts("wiki")

  return (
    <>
      <Navbar />
      <main className="flex-1 py-20">
        <Container>
          <FadeIn direction="down" className="flex flex-col space-y-4 mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary">
              Wiki
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Knowledge base, technical notes, and code snippets for quick reference.
            </p>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, i) => (
              <FadeIn key={note.slug} delay={i * 0.1}>
                <PostCard post={note} type="wiki" className="border-primary/10 hover:border-primary/30" />
              </FadeIn>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
