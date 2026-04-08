import React from "react"
import type { Metadata } from "next"
import { Clock, BookOpen, Rocket, Code, Coffee } from "lucide-react"
import { SafeLink } from "@/components/ui/safe-link"

const title = "Now"
const description = "A snapshot of what I'm currently focused on - learning, building, and reading."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/now",
  },
}

export default function NowPage() {
  const lastUpdated = "October 2023" // Example date

  return (
    <div className="min-h-screen pb-20 px-6 lg:px-8 pt-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 amoriaregular">What I&apos;m doing now</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </header>

        <div className="space-y-12">
          <section className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary/20 before:rounded-full">
            <div className="absolute left-[-12px] top-0 rounded-full bg-primary p-1 text-primary-foreground">
              <Rocket className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-bold mb-4 philosopher">Building</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                My primary focus is on refining this engineering portfolio and documentation platform. I&apos;m implementing advanced tools like a LaTeX to MathML converter and a scientific calculator to make it a true workspace.
              </p>
              <p>
                I&apos;m also working on a mechatronics project involving automated waste segregation systems, applying my mechanical design and electronic integration skills.
              </p>
            </div>
          </section>

          <section className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500/20 before:rounded-full">
            <div className="absolute left-[-12px] top-0 rounded-full bg-blue-500 p-1 text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-bold mb-4 philosopher">Learning</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Diving deeper into <strong>Next.js 15</strong> and <strong>Tailwind CSS 4</strong> to leverage the latest web technologies for technical documentation.
              </p>
              <p>
                Studying <strong>Control Systems</strong> and <strong>Robotics Kinematics</strong> as part of my engineering degree at OUSL.
              </p>
            </div>
          </section>

          <section className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-amber-500/20 before:rounded-full">
            <div className="absolute left-[-12px] top-0 rounded-full bg-amber-500 p-1 text-white">
              <Code className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-bold mb-4 philosopher">Side Projects</h2>
            <ul className="list-disc ml-4 space-y-2 text-muted-foreground">
              <li>Open source contributions to technical UI libraries.</li>
              <li>Experimenting with 3D printing and rapid prototyping.</li>
              <li>Writing technical tutorials for fellow engineering students.</li>
            </ul>
          </section>

          <section className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500/20 before:rounded-full">
            <div className="absolute left-[-12px] top-0 rounded-full bg-green-500 p-1 text-white">
              <Coffee className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-bold mb-4 philosopher">Life</h2>
            <p className="text-muted-foreground leading-relaxed">
              Currently based in Colombo, Sri Lanka. When I&apos;m not at my desk, I&apos;m likely exploring the outdoors, reading a book on philosophy, or enjoying a good cup of Ceylon tea.
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          This is a &quot;now page&quot;, and you should <SafeLink href="https://nownownow.com/about" className="text-primary hover:underline">have one too</SafeLink>.
        </footer>
      </div>
    </div>
  )
}
