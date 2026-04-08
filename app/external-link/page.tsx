"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AlertTriangle, ArrowRight, X } from "lucide-react"
import Link from "next/link"

const REDIRECT_DELAY = 5 // seconds

function ExternalLinkContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get("url")
  const [countdown, setCountdown] = useState(REDIRECT_DELAY)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Basic validation to check if we have a URL
  // In a real app, you might want more robust validation or a whitelist
  const isValidUrl = url && (url.startsWith("http://") || url.startsWith("https://"))

  useEffect(() => {
    if (!isValidUrl) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsRedirecting(true)
          window.location.href = url
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [url, isValidUrl])

  const handleProceed = () => {
    if (url) {
        setIsRedirecting(true)
        window.location.href = url
    }
  }

  const handleCancel = () => {
      // Try to close the window if it was opened by a script, otherwise show a message or redirect home
      // Since we opened in a new tab, window.close() might work if opened via script, 
      // but often browsers block it if not. 
      // Safe fallback: redirect to homepage or show "You can close this tab"
      try {
          window.close()
      } catch (e) {
          console.error("Could not close window", e)
      }
      // If window.close() fails (which it often does for security), we can inform the user 
      // or redirect them back to the site if they want to stay. 
      // Ideally "Cancel" here implies "Don't go to external site". 
      // Since it's a new tab, closing it is the most logical "Cancel".
  }

  if (!isValidUrl) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 shadow-lg">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h1 className="mb-2 text-2xl font-bold text-destructive">Invalid Link</h1>
          <p className="mb-6 text-muted-foreground">The link you are trying to visit is invalid or missing.</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  let hostname = ""
  try {
    hostname = new URL(url).hostname
  } catch (e) {
    hostname = "External Site"
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground selection:bg-primary/20">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-2xl transition-all duration-300">
        
        {/* Glow effect */}
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-yellow-500/10 p-4 ring-1 ring-yellow-500/20">
            <AlertTriangle className="h-10 w-10 text-yellow-500" />
          </div>

          <h2 className="mb-2 text-2xl font-bold tracking-tight">Leaving Our Site</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            You are being redirected to an external website.
          </p>

          <div className="mb-8 w-full rounded-xl border border-border/50 bg-muted/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Destination</p>
            <p className="mt-1 truncate text-lg font-medium text-primary">{hostname}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground opacity-60">{url}</p>
          </div>

          <div className="mb-6 flex items-center gap-2 text-sm font-medium">
             {isRedirecting ? (
                 <span className="flex items-center gap-2 text-primary animate-pulse">
                     Redirecting...
                 </span>
             ) : (
                <span className="text-muted-foreground">
                    Auto-redirecting in <span className="font-bold text-foreground">{countdown}</span> seconds
                </span>
             )}
          </div>
          
           {/* Progress bar */}
           <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div 
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${((REDIRECT_DELAY - countdown) / REDIRECT_DELAY) * 100}%` }}
            />
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleProceed}
              className="group flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-95"
            >
              Proceed Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExternalLinkPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <ExternalLinkContent />
        </Suspense>
    )
}
