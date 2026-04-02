import Link from "next/link"
import { ArrowRight, Code, BookOpen, PenTool, Globe } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { PostCard } from "@/components/post-card"
import { getAllPosts } from "@/lib/content"
import { FadeIn } from "@/components/fade-in"

export default async function Home() {
  const latestBlogPosts = (await getAllPosts("blog")).slice(0, 3)
  const latestProjects = (await getAllPosts("projects")).slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--color-primary)_0%,transparent_100%)] opacity-10"></div>
          <Container>
            <div className="flex flex-col items-center text-center space-y-8">
              <FadeIn direction="down" delay={0.1}>
                <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Globe className="h-4 w-4" />
                  <span>Available for new projects</span>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                  Building the future with <span className="text-primary">elegant code</span> and <span className="text-secondary">modern design</span>.
                </h1>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                  A personal space where I share my engineering journey, technical insights, and the projects I've built.
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/projects"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                  >
                    View Projects
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background/50 px-8 text-sm font-medium backdrop-blur-sm transition-all hover:bg-secondary hover:text-secondary-foreground"
                  >
                    Read Blog
                  </Link>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Latest Blog Posts */}
        <section className="py-20 bg-secondary/30">
          <Container>
            <FadeIn direction="none" className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Latest Blog Posts</h2>
                <p className="text-muted-foreground">Thoughts on engineering and development.</p>
              </div>
              <Link href="/blog" className="group flex items-center space-x-1 text-sm font-semibold text-primary">
                <span>View all</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeIn>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestBlogPosts.map((post, i) => (
                <FadeIn key={post.slug} delay={i * 0.1}>
                  <PostCard post={post} type="blog" />
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Featured Projects */}
        <section className="py-20">
          <Container>
            <FadeIn direction="none" className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
                <p className="text-muted-foreground">Some of the things I've built.</p>
              </div>
              <Link href="/projects" className="group flex items-center space-x-1 text-sm font-semibold text-primary">
                <span>View all</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeIn>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestProjects.map((project, i) => (
                <FadeIn key={project.slug} delay={i * 0.1}>
                  <PostCard post={project} type="projects" />
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Services/Focus Areas */}
        <section className="py-20 bg-secondary/30">
          <Container>
            <FadeIn delay={0.1} className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Technical Focus</h2>
              <p className="text-muted-foreground mt-4">Areas where I spend most of my time.</p>
            </FadeIn>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Frontend Engineering", desc: "Building responsive and accessible user interfaces with React and Next.js.", icon: PenTool },
                { title: "Backend Systems", desc: "Designing scalable APIs and working with modern databases.", icon: Code },
                { title: "Documentation", desc: "Writing clear technical guides and maintaining wikis.", icon: BookOpen },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex flex-col space-y-4 rounded-2xl border border-border/40 bg-card/50 p-8 glass-card h-full">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
