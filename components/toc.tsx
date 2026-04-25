"use client"

import { useState, useEffect, useRef, useMemo, startTransition } from "react"
import { List, ChevronRight, ChevronRight as ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TOCProps {
  content: string
}

export function TOC({ content }: TOCProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState(true)
  const isScrollingFromClick = useRef(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const headings = useMemo<TOCItem[]>(() => {
    // Extract headings from HTML content
    // Improved regex to be more flexible with attribute order and case sensitivity
    const headingRegex = /<h([2-3])\s+[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/h\1\s*>/gi
    const matches = Array.from(content.matchAll(headingRegex))
    
    return matches.map((match) => {
      let cleanText = match[3];
      while (/<[^>]*>/g.test(cleanText)) {
        cleanText = cleanText.replace(/<[^>]*>/g, "");
      }
      return {
        level: parseInt(match[1]),
        id: match[2],
        text: cleanText.trim(), // Remove any nested HTML tags in heading
      };
    })
  }, [content])

  useEffect(() => {
    if (headings.length === 0) return

    const setupObserver = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          // If we're scrolling as a result of a click, don't let the observer change the activeId
          // until the jump is mostly complete.
          if (isScrollingFromClick.current) return

          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        { 
          // Match the scroll-margin-top in globals.css (100px)
          // We use a narrow band near the top of the viewport
          rootMargin: "-110px 0% -70% 0%" 
        }
      )

      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) observer.observe(element)
      })

      return observer
    }

    const observer = setupObserver()

    // Handle initial hash on load
    if (window.location.hash) {
      const hash = window.location.hash.substring(1)
      if (headings.some(h => h.id === hash)) {
        startTransition(() => {
          setActiveId(hash)
        })
      }
    }

    const handleHashChange = () => {
      if (window.location.hash) {
        const hash = window.location.hash.substring(1)
        if (headings.some(h => h.id === hash)) {
          startTransition(() => {
            setActiveId(hash)
          })
        }
      }
    }
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      observer.disconnect()
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [headings])

  // Auto-scroll TOC sidebar to keep active item in view
  useEffect(() => {
    if (activeId && !isCollapsed) {
      const activeElement = document.querySelector(`nav a[href="#${activeId}"]`)
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  }, [activeId, isCollapsed])

  if (headings.length === 0) return null

  return (
    <nav 
      className={cn(
        "hidden lg:block fixed right-4 top-24 z-50 h-fit shrink-0 transition-all duration-300 ease-in-out bg-background/80 backdrop-blur-md border border-border/50 shadow-lg",
        isCollapsed 
          ? "w-fit p-1 rounded-full items-center justify-center flex" 
          : "w-72 p-4 rounded-lg overflow-y-auto max-h-[calc(100vh-8rem)] custom-scrollbar"
      )}
    >
      <div className={cn("flex items-center gap-2", isCollapsed ? "justify-center m-0" : "mb-4 px-2")}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative group",
            isCollapsed && "text-foreground"
          )}
          title={isCollapsed ? "Expand Table of Contents" : "Collapse Table of Contents"}
        >
          {isCollapsed ? (
            <div className="relative">
               <List className="h-5 w-5" />
               <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
           
          ) : (
            <div className="flex items-center justify-center">
              <ChevronRightIcon className="h-5 w-5 rotate-180" />
            </div>
          )}
        </button>
        
        {!isCollapsed && (
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground whitespace-nowrap overflow-hidden">
            Content
          </h3>
        )}
      </div>

      {!isCollapsed && (
        <ul className="space-y-1 border-l border-border animate-in fade-in duration-300 font-local-inter">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={() => {
                  // Explicitly set activeId on click
                  setActiveId(heading.id)
                  
                  // Set flag to prevent observer from overriding this immediately
                  isScrollingFromClick.current = true
                  
                  // Clear existing timeout
                  if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
                  
                  // Allow observer to take back control after jump is finished
                  scrollTimeoutRef.current = setTimeout(() => {
                    isScrollingFromClick.current = false
                  }, 1000)
                }}
                className={cn(
                  "group flex items-center py-2 pr-4 transition-all hover:text-primary relative",
                  heading.level === 3 ? "pl-8 text-xs" : "pl-4 text-sm font-medium",
                  activeId === heading.id 
                    ? "text-primary border-l-2 border-primary -ml-[1.5px] bg-primary/5" 
                    : "text-muted-foreground border-l border-transparent"
                )}
              >
                <span className="truncate">{heading.text}</span>
                <ChevronRight className={cn(
                  "h-3 w-3 ml-auto opacity-0 transition-all group-hover:opacity-100 shrink-0",
                  activeId === heading.id && "opacity-100"
                )} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
