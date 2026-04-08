import React from "react"
import type { Metadata } from "next"
import { Monitor, Laptop, Keyboard, Mouse, Smartphone, Headphones, Code2, Terminal, Globe, Palette, AppWindow, Database } from "lucide-react"

const title = "Uses"
const description = "A detailed look at my hardware setup, software stack, and development tools."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/uses",
  },
}

const hardware = [
  {
    name: "Primary Laptop",
    description: "MacBook Pro M2 Pro, 16GB RAM, 512GB SSD",
    icon: Laptop,
  },
  {
    name: "Monitor",
    description: "27\" 4K LG UltraFine Display",
    icon: Monitor,
  },
  {
    name: "Keyboard",
    description: "Keychron K2 V2 with Brown Switches",
    icon: Keyboard,
  },
  {
    name: "Mouse",
    description: "Logitech MX Master 3S",
    icon: Mouse,
  },
  {
    name: "Audio",
    description: "Sony WH-1000XM5 & AirPods Pro 2",
    icon: Headphones,
  },
  {
    name: "Mobile",
    description: "iPhone 14 Pro",
    icon: Smartphone,
  },
]

const software = [
  {
    category: "Development",
    icon: Code2,
    items: [
      { name: "VS Code", description: "Primary editor with Tokyo Night theme" },
      { name: "iTerm2", description: "Terminal emulator with Oh My Zsh" },
      { name: "Docker", description: "Containerization for local development" },
      { name: "Postman", description: "API testing and documentation" },
    ],
  },
  {
    category: "Languages & Frameworks",
    icon: Globe,
    items: [
      { name: "TypeScript", description: "Primary language for web development" },
      { name: "Next.js", description: "Full-stack React framework" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework" },
      { name: "Python", description: "For data processing and scripting" },
    ],
  },
  {
    category: "Design",
    icon: Palette,
    items: [
      { name: "Figma", description: "UI/UX design and prototyping" },
      { name: "Canva", description: "Quick graphics and social media assets" },
      { name: "Adobe CC", description: "Photoshop and Illustrator for complex assets" },
    ],
  },
  {
    category: "Productivity",
    icon: AppWindow,
    items: [
      { name: "Notion", description: "Note-taking and project management" },
      { name: "Slack", description: "Team communication" },
      { name: "Arc Browser", description: "My daily driver for browsing" },
      { name: "Raycast", description: "Spotlight replacement on macOS" },
    ],
  },
]

export default function UsesPage() {
  return (
    <div className="min-h-screen pb-20 px-6 lg:px-8 pt-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 amoriaregular">Uses</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive list of the tools, apps, and hardware I use on a daily basis to build engineering solutions.
          </p>
        </header>

        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 philosopher">
            <Monitor className="h-6 w-6 text-primary" />
            Hardware Setup
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {hardware.map((item, idx) => (
              <div key={idx} className="group rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 philosopher">
            <Terminal className="h-6 w-6 text-primary" />
            Software Stack
          </h2>
          <div className="space-y-12">
            {software.map((category, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 border-l-4 border-primary pl-4">
                  <category.icon className="h-5 w-5 text-primary" />
                  {category.category}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {category.items.map((item, i) => (
                    <div key={i} className="rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                      <div className="font-bold text-foreground mb-1">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          Inspired by <a href="https://uses.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">uses.tech</a>
        </footer>
      </div>
    </div>
  )
}
