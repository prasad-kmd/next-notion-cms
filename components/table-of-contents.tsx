"use client"

import * as React from "react"
import { ListIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [items, setItems] = React.useState<TOCItem[]>([])
  const [activeId, setActiveId] = React.useState<string>("")

  React.useEffect(() => {
    // Basic extraction of headings from markdown string
    const lines = content.split("\n")
    const extractedItems: TOCItem[] = []

    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.*)$/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
        extractedItems.push({ id, text, level })
      }
    })

    setItems(extractedItems)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -40% 0px" }
    )

    extractedItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [content])

  if (items.length === 0) return null

  return (
    <div className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent">
      <div className="flex items-center space-x-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        <ListIcon className="h-4 w-4" />
        <span>On this page</span>
      </div>
      <nav className="flex flex-col space-y-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "text-sm transition-all duration-200 hover:text-primary py-1",
              activeId === item.id ? "text-primary font-medium" : "text-muted-foreground",
              item.level === 1 ? "ml-0" : item.level === 2 ? "ml-4" : item.level === 3 ? "ml-8" : "ml-12"
            )}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  )
}
