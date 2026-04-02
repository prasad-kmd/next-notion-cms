import { Container } from "@/components/container"
import { FadeIn } from "@/components/fade-in"
import { Code2, Cpu, Globe, GraduationCap, Laptop, Rocket } from "lucide-react"

export const metadata = {
  title: "About",
  description: "Learn more about the engineer behind this blogfolio.",
}

export default function AboutPage() {
  return (
    <div className="py-20">
      <Container>
        <FadeIn>
          <div className="max-w-3xl space-y-12">
            <section className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
                About Me
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                I'm a passionate Software Engineer focused on building high-performance,
                user-centric web applications and exploring the depths of modern engineering.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors space-y-3">
                <Code2 className="text-primary h-8 w-8" />
                <h3 className="text-xl font-bold">Frontend Development</h3>
                <p className="text-muted-foreground text-sm">
                  Specializing in React, Next.js, and TypeScript to create fluid,
                  responsive, and accessible interfaces.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors space-y-3">
                <Cpu className="text-primary h-8 w-8" />
                <h3 className="text-xl font-bold">Backend & Systems</h3>
                <p className="text-muted-foreground text-sm">
                  Experienced in Node.js, Go, and distributed systems architecture
                  to build scalable and reliable backends.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors space-y-3">
                <Rocket className="text-primary h-8 w-8" />
                <h3 className="text-xl font-bold">Performance Optimization</h3>
                <p className="text-muted-foreground text-sm">
                  Obsessed with Core Web Vitals, bundle sizes, and efficient
                  rendering strategies to deliver the best UX.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors space-y-3">
                <Globe className="text-primary h-8 w-8" />
                <h3 className="text-xl font-bold">Open Source</h3>
                <p className="text-muted-foreground text-sm">
                  Active contributor to the ecosystem and believer in the
                  power of collaborative software development.
                </p>
              </div>
            </div>

            <section className="space-y-6 pt-12">
              <h2 className="text-3xl font-bold">Experience & Education</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Laptop className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Senior Software Engineer</h4>
                    <p className="text-muted-foreground">Tech Innovations Inc. • 2021 — Present</p>
                    <p className="mt-2 text-sm leading-relaxed">
                      Leading frontend architecture for a high-traffic SaaS platform,
                      improving performance by 40% and mentoring junior developers.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">B.Sc. in Computer Science</h4>
                    <p className="text-muted-foreground">University of Technology • 2017 — 2021</p>
                    <p className="mt-2 text-sm leading-relaxed">
                      Specialized in Software Engineering and Distributed Systems.
                      Graduated with honors.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}
