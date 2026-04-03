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
      // Avoid adding multiple buttons if the effect runs more than once
      if (pre.querySelector(".copy-button-container")) return

      const codeElement = pre.querySelector("code")
      const content = codeElement?.innerText || ""

      const wrapper = document.createElement("div")
      wrapper.className = "copy-button-container absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"

      // Make sure the pre has relative positioning and group class
      pre.classList.add("relative", "group")
      pre.appendChild(wrapper)

      const root = createRoot(wrapper)
      root.render(<CopyButton content={content} />)
    })
  }, [])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}
