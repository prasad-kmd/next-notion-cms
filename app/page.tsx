import Link from "next/link"
import { ArrowRight, Code, BookOpen, PenTool, Globe, ChevronRight } from "lucide-react"
import { Container } from "@/components/container"
import { PostCard } from "@/components/post-card"
import { getAllPosts } from "@/lib/content"
import { FadeIn } from "@/components/fade-in"

export default async function Home() {
  const latestBlogPosts = (await getAllPosts("blog")).slice(0, 3)
  const latestProjects = (await getAllPosts("projects")).slice(0, 3)

  return (
    <>
      <div className="flex-1">
        {/* Hero Section - Viewport fitted */}
        <section className="relative flex flex-col justify-center min-h-screen overflow-hidden pb-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,var(--color-primary)_0.1,transparent_100%)] opacity-30 dark:opacity-15"></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,var(--color-secondary)_0.1,transparent_100%)] opacity-20 dark:opacity-10"></div>

          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-start space-y-8 text-left">
                {/* <FadeIn direction="down" delay={0.1}>
                  <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span>Available for new projects</span>
                  </div>
                </FadeIn> */}

                <FadeIn delay={0.2} direction="none">
                  <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.1]">
                    Engineering <br/>
                    <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
                      the digital future.
                    </span>
                  </h1>
                </FadeIn>

                <FadeIn delay={0.3} direction="none">
                  <p className="max-w-xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
                    A high-performance workspace and personal platform showcasing engineering excellence, technical writing, and innovative projects.
                  </p>
                </FadeIn>

                <FadeIn delay={0.4} direction="none">
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/projects"
                      className="group inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
                    >
                      Explore Projects
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/blog"
                      className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background/50 px-8 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-secondary hover:text-secondary-foreground"
                    >
                      Read Articles
                    </Link>
                  </div>
                </FadeIn>
              </div>

              {/* who am i code block */}
              <FadeIn delay={0.5} direction="left" className="hidden lg:block">
                <div className="relative aspect-square max-w-[500px] mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
                  <div className="relative h-full w-full rounded-3xl border border-border/40 bg-card/30 p-8 glass-card flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <div className="h-3 w-3 rounded-full bg-red-500/50" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                        <div className="h-3 w-3 rounded-full bg-green-500/50" />
                      </div>
                      <div className="space-y-2 font-mono text-sm">
                        <p className="text-primary">$ <span className="text-foreground">whoami</span></p>
                        <p className="text-muted-foreground">Engineering Professional</p>
                        <p className="text-primary mt-4">$ <span className="text-foreground">skills --list</span></p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {["React", "Next.js", "TypeScript", "Node.js", "Docker"].map(s => (
                            <span key={s} className="px-2 py-0.5 rounded-md bg-secondary/50 border border-border/40 text-xs">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pt-8 flex items-center justify-between border-t border-border/20">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-secondary" />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Collaborated with teams worldwide</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Latest Blog Posts */}
        <section className="py-24 border-y border-border/40 bg-secondary/10">
          <Container>
            <FadeIn direction="none" className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Recent Insights</h2>
                <p className="text-muted-foreground">Exploring new technologies and best practices.</p>
              </div>
              <Link href="/blog" className="group flex items-center space-x-1 text-sm font-semibold text-primary">
                <span>Browse all posts</span>
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
        <section className="py-24">
          <Container>
            <FadeIn direction="none" className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
                <p className="text-muted-foreground">Innovative solutions for complex problems.</p>
              </div>
              <Link href="/projects" className="group flex items-center space-x-1 text-sm font-semibold text-primary">
                <span>View all work</span>
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

        {/* Technical Stack */}
        <section className="py-24 bg-secondary/10 border-t border-border/40">
          <Container>
            <FadeIn delay={0.1} className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Technical Proficiency</h2>
              <p className="text-muted-foreground mt-4">Leveraging modern tools to build reliable software.</p>
            </FadeIn>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Frontend Mastery", desc: "Expertise in React, Next.js, and high-performance Tailwind-driven architectures.", icon: PenTool },
                { title: "Systems Engineering", desc: "Robust backend logic, scalable microservices, and high-performance API design.", icon: Code },
                { title: "Technical Writing", desc: "Crafting detailed, accessible documentation and architectural wikis for complex systems.", icon: BookOpen },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex flex-col space-y-4 rounded-2xl border border-border/40 bg-card/50 p-8 glass-card h-full hover:border-primary/40 transition-colors">
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
      </div>
    </>
  )
}
