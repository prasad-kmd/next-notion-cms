import React from "react"
import type { Metadata } from "next"
import Roadmap from "@/components/roadmap"
import { Calendar, Target, Flag } from "lucide-react"

const title = "Project Roadmap"
const description = "A public roadmap showing the progress and future plans for my engineering projects and this platform."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/roadmap",
  },
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen pb-20 px-6 lg:px-8 pt-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Flag className="h-3 w-3" />
            Public Roadmap
          </div>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 amoriaregular">Project Roadmap</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparency is key to engineering excellence. Here&apos;s a look at where I&apos;ve been and where I&apos;m heading.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-bold mb-1">Status</h3>
            <p className="text-sm text-muted-foreground">Semester 2 - Q1 in progress</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="font-bold mb-1">Focus</h3>
            <p className="text-sm text-muted-foreground">Prototyping & Simulations</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <Flag className="h-6 w-6" />
            </div>
            <h3 className="font-bold mb-1">Milestones</h3>
            <p className="text-sm text-muted-foreground">3 Completed, 4 Remaining</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card/50 p-8 lg:p-12 backdrop-blur-sm shadow-xl">
          <Roadmap />
        </div>

        <div className="mt-20 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h3 className="text-xl font-bold mb-2 philosopher">Have a suggestion?</h3>
          <p className="text-muted-foreground mb-6">
            I&apos;m always looking for feedback and new ideas to improve my projects.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            Get in touch
          </a>
        </div>
      </div>
    </div>
  )
}
