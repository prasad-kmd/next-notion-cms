"use client"

import React, { useState } from "react"
import { Code2, Copy, Search, Terminal, Filter, Cpu, Database } from "lucide-react"

const snippets = [
  {
    title: "Next.js 15 Async Params",
    description: "How to properly await params in Next.js 15 page components.",
    code: `export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // Use slug...
}`,
    language: "typescript",
    category: "Web Dev",
  },
  {
    title: "Tailwind 4 Glassmorphism",
    description: "A reusable class for glassmorphism effects in Tailwind CSS 4.",
    code: `<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl">
  {/* Content */}
</div>`,
    language: "html",
    category: "Design",
  },
  {
    title: "Arduino Serial Debug",
    description: "Standard serial initialization for Arduino mechatronics projects.",
    code: `void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for serial port to connect
  }
  Serial.println("System Initialized");
}`,
    language: "cpp",
    category: "Mechatronics",
  },
  {
    title: "Python List Comprehension",
    description: "Quickly filter and map lists in Python.",
    code: `items = [1, 2, 3, 4, 5]
squared_evens = [x**2 for x in items if x % 2 == 0]
# Output: [4, 16]`,
    language: "python",
    category: "Python",
  },
]

export default function SnippetsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredSnippets = snippets.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || s.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen pb-20 px-6 lg:px-8 pt-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 amoriaregular">Code Snippets</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A personal library of reusable snippets and technical cheatsheets to speed up development.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search snippets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
             {["All", "Web Dev", "Mechatronics", "Design", "Python"].map((cat) => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-4 py-2 rounded-full border border-border text-sm whitespace-nowrap transition-all ${
                    activeCategory === cat 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredSnippets.map((snippet, idx) => (
            <div key={idx} className="group rounded-2xl border border-border bg-card overflow-hidden flex flex-col transition-all hover:border-primary/50 hover:shadow-xl">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    {snippet.category}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {snippet.language}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{snippet.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {snippet.description}
                </p>
                <div className="relative">
                  <pre className="rounded-xl bg-muted p-4 text-xs font-mono overflow-x-auto border border-border group-hover:border-primary/30 transition-colors">
                    <code>{snippet.code}</code>
                  </pre>
                  <button className="absolute top-2 right-2 p-1.5 rounded-md bg-background/50 text-muted-foreground hover:text-foreground hover:bg-background transition-all opacity-0 group-hover:opacity-100">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                   {snippet.category === "Mechatronics" ? <Cpu className="h-4 w-4 text-primary" /> : <Code2 className="h-4 w-4 text-primary" />}
                   <span className="text-xs font-medium text-muted-foreground">Reusable Snippet</span>
                </div>
                <button className="text-xs font-bold text-primary hover:underline">View Full Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
