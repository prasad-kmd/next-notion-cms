"use client"

import { Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function WebShareButton({ isCollapsed }: { isCollapsed?: boolean }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: "Check out this page!",
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
      } catch (error) {
        console.error("Failed to copy URL:", error)
        alert("Failed to copy URL. Please copy it manually.")
      }
    }
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          onClick={handleShare}
          data-testid="share-button"
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all relative group local-jetbrains-mono",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            isCollapsed ? "lg:justify-center lg:px-2 lg:gap-0" : "justify-start"
          )}
        >
          <Share2 className="h-5 w-5 shrink-0" />
          <span className={cn(
            "animate-in fade-in slide-in-from-left-2 duration-300",
            isCollapsed ? "lg:hidden" : ""
          )}>
            {copied ? "Copied!" : "Share"}
          </span>
        </button>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" className="ml-2">
          {copied ? "Copied!" : "Share"}
        </TooltipContent>
      )}
    </Tooltip>
  )
}
