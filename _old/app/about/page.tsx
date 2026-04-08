import { Container } from "@/components/container"
import { FadeIn } from "@/components/fade-in"
import { Target, Lightbulb, ArrowRight, Settings, Cpu, HardDrive, ShieldCheck } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "About",
  description: "Learn more about the engineer behind this blogfolio.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] border-b border-border overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1581092346583-f7122856243e?q=80&w=2070&auto=format&fit=crop" 
          alt="About Me" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 h-full flex items-center justify-center text-center">
          <FadeIn direction="down" className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl mozilla-headline mb-6">
              ABOUT MY JOURNEY
            </h1>
            <p className="text-lg leading-relaxed text-gray-200 google-sans font-medium">
              A personal engineering journey focused on identifying and solving real-world challenges through innovative mechanical and mechatronics solutions.
            </p>
          </FadeIn>
        </div>
      </section>

      <Container className="mt-20">
        {/* Core Pillars */}
        <div className="grid gap-8 md:grid-cols-3 mb-24">
          {[
            { 
              icon: Target, 
              title: "My Mission", 
              desc: "To identify pressing engineering challenges and develop practical, sustainable solutions that make a meaningful impact on communities and industries." 
            },
            { 
              icon: Lightbulb, 
              title: "My Approach", 
              desc: "Combining mechanical and mechatronics expertise to create interdisciplinary solutions. I focus on innovation, sustainability, and real-world applicability." 
            },
            { 
              icon: Cpu, 
              title: "My Expertise", 
              desc: "Specializing in mechatronics systems, mechanical design, and automation. I bring a comprehensive technical background to tackle complex engineering problems." 
            },
          ].map((pillar, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-border bg-card/50 p-8 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/50 group">
                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4 text-primary group-hover:scale-110 transition-transform">
                  <pillar.icon size={24} />
                </div>
                <h2 className="mb-4 text-xl font-bold google-sans">{pillar.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground google-sans font-medium">
                  {pillar.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="grid gap-16 lg:grid-cols-2 mb-24">
          {/* Professional Context */}
          <FadeIn direction="right">
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-bold mozilla-headline tracking-tight mb-6">PROFESSIONAL CONTEXT</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed google-sans font-medium">
                  <p>
                    As an engineering undergraduate, I am dedicated to exploring the &quot;Big Idea&quot; - identifying meaningful challenges that require innovative engineering solutions.
                  </p>
                  <p>
                    My focus is on addressing complex problems through the lens of mechanical and mechatronics engineering. By leveraging my technical skills and interdisciplinary perspective, I strive to develop solutions that are not only technically sound but also practical and sustainable.
                  </p>
                  <p>
                    Throughout my journey, I am documenting my progress - from initial ideation and research to design, prototyping, and testing. This platform serves as my personal workspace and public portfolio.
                  </p>
                </div>
              </section>

              {/* Engineering Toolbox */}
              <section className="rounded-2xl border border-border bg-muted/30 p-8 glass-card">
                <h2 className="text-2xl font-bold google-sans mb-6 flex items-center gap-2">
                  <Settings className="text-primary" size={24} />
                  Engineering Toolbox
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    { title: "Design & CAD", icon: HardDrive, items: ["SolidWorks", "AutoCAD", "Fusion 360"] },
                    { title: "Mechatronics", icon: Cpu, items: ["Arduino", "Raspberry Pi", "ROS"] },
                    { title: "Analysis", icon: Target, items: ["ANSYS", "MATLAB", "Simulation"] },
                    { title: "Standards", icon: ShieldCheck, items: ["ISO", "SLS", "Safety Protocols"] },
                  ].map((category, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center gap-2 font-bold text-foreground google-sans text-sm">
                        <category.icon size={16} className="text-primary" />
                        {category.title}
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1.5 ml-6 list-disc">
                        {category.items.map((item, i) => <li key={i} className="google-sans">{item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </FadeIn>

          {/* Project Timeline */}
          <FadeIn direction="left">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold mozilla-headline tracking-tight mb-8">MILESTONES</h2>
              <div className="space-y-12 border-l-2 border-border/50 pl-8 ml-4">
                {[
                  { role: "Senior Engineering Consultant", period: "2021 — Present", company: "Global Tech Solutions", desc: "Spearheading digital transformation initiatives and architectural oversight." },
                  { role: "B.Sc. Engineering", period: "2017 — 2021", company: "Technical University", desc: "Specialized in Mechatronics and Computer Integrated Manufacturing." },
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/20" />
                    <h4 className="text-xl font-bold google-sans">{item.role}</h4>
                    <p className="text-primary font-bold uppercase tracking-widest text-[10px] mt-1">{item.company} • {item.period}</p>
                    <p className="mt-4 text-muted-foreground leading-relaxed google-sans text-sm">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* CTA Section */}
        <FadeIn direction="up">
          <section className="rounded-[2.5rem] bg-primary/5 border border-primary/20 p-12 text-center backdrop-blur-sm shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-primary),transparent)] opacity-5" />
             <div className="relative z-10">
              <h2 className="text-3xl font-bold mozilla-headline mb-4">INTERESTED IN MY WORK?</h2>
              <p className="mx-auto mb-8 max-w-2xl text-muted-foreground google-sans font-medium">
                Explore my latest project logs, technical articles, and demonstrations as I work towards developing innovative engineering solutions.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
                >
                  View Projects
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-background/50 px-10 py-4 font-bold transition-all hover:bg-muted"
                >
                  Read Blog
                </Link>
              </div>
             </div>
          </section>
        </FadeIn>
      </Container>
    </div>
  )
}
