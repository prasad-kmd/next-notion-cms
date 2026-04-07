"use client"

import React, { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import { CopyButton } from "./ui/copy-button"

interface CodeBlockWrapperProps {
  children: React.ReactNode
}

export function CodeBlockWrapper({ children }: CodeBlockWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const preElements = containerRef.current.querySelectorAll("pre")

    preElements.forEach((pre) => {
      // Avoid adding multiple buttons/headers if the effect runs more than once
      if (pre.querySelector(".code-block-header")) return

      const codeElement = pre.querySelector("code")
      const content = codeElement?.innerText || ""
      
      // Get language from class (e.g., language-javascript)
      const langClass = Array.from(codeElement?.classList || []).find(c => c.startsWith('language-'));
      const language = langClass ? langClass.replace('language-', '') : 'code';

      // Create header
      const header = document.createElement("div")
      header.className = "code-block-header flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-xs font-mono text-muted-foreground"
      
      const langSpan = document.createElement("span")
      langSpan.textContent = language.toUpperCase()
      header.appendChild(langSpan)

      const buttonContainer = document.createElement("div")
      buttonContainer.className = "copy-button-container"
      header.appendChild(buttonContainer)

      // Make sure the pre has relative positioning and group class
      pre.classList.add("relative", "group")
      // Insert header at the top
      pre.insertBefore(header, pre.firstChild)

      const root = createRoot(buttonContainer)
      root.render(<CopyButton content={content} className="p-1 border-none bg-transparent hover:text-foreground" />)
    })
  }, [])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}
