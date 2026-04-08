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
        <section className="relative flex flex-col justify-center h-[calc(100vh-64px)] min-h-[600px] overflow-hidden lg:h-[calc(100vh-0px)]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,var(--color-primary)_0.15,transparent_100%)] opacity-40 dark:opacity-20"></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,var(--color-secondary)_0.15,transparent_100%)] opacity-30 dark:opacity-15"></div>
          
          {/* Animated background elements */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />

          <Container>
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-3 flex flex-col items-start space-y-8 text-left">
                <div className="space-y-4">
                  <FadeIn delay={0.1} direction="down">
                    <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur-md uppercase tracking-widest google-sans">
                      <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span>Engineering Workspace v2.0</span>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.2} direction="none">
                    <h1 className="text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.85] mozilla-headline">
                      CRAFTING <br/>
                      <span className="bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent">
                        TECHNICAL
                      </span> <br/>
                      EXCELLENCE.
                    </h1>
                  </FadeIn>
                </div>

                <FadeIn delay={0.3} direction="none">
                  <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed google-sans font-medium opacity-80">
                    A high-performance ecosystem where hardware meets software. Documenting the intersection of mechatronics, digital architecture, and engineering innovation.
                  </p>
                </FadeIn>

                <FadeIn delay={0.4} direction="none">
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/projects"
                      className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
                    >
                      <span className="relative z-10 flex items-center">
                        View Projects
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                    <Link
                      href="/blog"
                      className="group inline-flex h-12 items-center justify-center rounded-xl border-2 border-border bg-background/40 px-8 text-sm font-bold backdrop-blur-xl transition-all hover:bg-secondary hover:border-primary/50"
                    >
                      Read Wiki
                    </Link>
                  </div>
                </FadeIn>

                <FadeIn delay={0.5} direction="up">
                  <div className="flex items-center gap-8 pt-6 border-t border-border/20 w-full">
                    {[
                      { label: "Articles", value: "50+" },
                      { label: "Projects", value: "20+" },
                      { label: "Tools", value: "30+" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex flex-col">
                        <span className="text-xl font-bold text-foreground mozilla-headline tracking-tight">{stat.value}</span>
                        <span className="text-[10px] text-muted-foreground google-sans uppercase tracking-widest font-bold">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              </div>

              {/* who am i code block */}
              <FadeIn delay={0.6} direction="left" className="hidden lg:block lg:col-span-2 relative">
                <div className="relative w-full max-w-[420px] ml-auto">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
                  <div className="relative h-full w-full rounded-3xl border border-border/40 bg-card/30 p-6 glass-card flex flex-col justify-between aspect-[4/5] shadow-2xl">
                    <div className="space-y-6">
                      <div className="flex space-x-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                      </div>
                      <div className="space-y-4 font-mono text-sm leading-relaxed">
                        <div className="space-y-1">
                          <p className="text-primary font-bold">$ <span className="text-foreground">whoami</span></p>
                          <p className="text-muted-foreground pl-4 border-l border-primary/20">Engineering Professional & Digital Architect</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-primary font-bold">$ <span className="text-foreground">skills --list</span></p>
                          <div className="flex flex-wrap gap-2 pt-1 pl-4 border-l border-primary/20">
                            {["Next.js 16", "Tailwind 4", "Mechatronics", "Robotics", "Embedded"].map(s => (
                              <span key={s} className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-primary font-bold">$ <span className="text-foreground">status --current</span></p>
                          <p className="text-green-500/80 pl-4 border-l border-primary/20 animate-pulse">● Innovating solutions</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 flex items-center justify-between border-t border-border/20">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-7 w-7 rounded-full border-2 border-background bg-secondary/80 backdrop-blur-sm" />
                        ))}
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Workspace v2.0</p>
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
