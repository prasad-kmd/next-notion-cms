"use client"

import { useState, useMemo } from "react"
import {
  Terminal,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Code2,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"

export default function RegexArchitectPage() {
  const [pattern, setPattern] = useState("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})")
  const [flags, setFlags] = useState("g")
  const [testString, setTestString] = useState("Contact us at support@example.com or sales@company.org")

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: null }
    try {
      const regex = new RegExp(pattern, flags)
      const matchesArray = []
      let match

      // Handle non-global regex to avoid infinite loop
      if (!flags.includes("g")) {
        match = regex.exec(testString)
        if (match) matchesArray.push(match)
      } else {
        while ((match = regex.exec(testString)) !== null) {
          matchesArray.push(match)
          if (match.index === regex.lastIndex) regex.lastIndex++ // avoid infinite loop on empty matches
        }
      }
      return { matches: matchesArray, error: null }
    } catch (e) {
      return {
        matches: [],
        error: e instanceof Error ? e.message : "Invalid regular expression"
      }
    }
  }, [pattern, flags, testString])

  const highlightedText = useMemo(() => {
    if (error || !pattern || matches.length === 0) return testString

    let lastIndex = 0
    const parts = []

    matches.forEach((match, i) => {
      // Add text before match
      parts.push(testString.slice(lastIndex, match.index))
      // Add highlighted match
      parts.push(
        <span
          key={i}
          className="bg-primary/30 border-b-2 border-primary text-foreground rounded-sm px-0.5"
          title={`Match ${i + 1}`}
        >
          {match[0]}
        </span>
      )
      lastIndex = match.index + match[0].length
    })

    // Add remaining text
    parts.push(testString.slice(lastIndex))
    return parts
  }, [testString, matches, error, pattern])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/tools"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Workspace
          </Link>
          <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
            <Terminal className="h-8 w-8 text-primary" />
            Regex Pattern Architect
          </h1>
          <p className="mt-2 text-muted-foreground leading-relaxed font-sans">
            Visual regular expression builder and tester with real-time match highlighting and explanation.
          </p>
        </div>

        <div className="space-y-6">
          {/* Pattern Input */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 font-sans">
                    <Code2 className="h-4 w-4 text-primary" /> Regular Expression
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
                    <Input
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="Enter regex pattern..."
                      className="pl-6 font-mono bg-background/50"
                    />
                  </div>
                </div>
                <div className="w-full md:w-32 space-y-2">
                  <label className="text-sm font-medium font-sans">Flags</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
                    <Input
                      value={flags}
                      onChange={(e) => setFlags(e.target.value)}
                      placeholder="gim"
                      className="pl-6 font-mono bg-background/50"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(`/${pattern}/${flags}`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {error && (
                <div className="mt-4 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 font-sans">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test String */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2 font-sans">
                  <Search className="h-4 w-4 text-primary" /> Test String
                </label>
                <div className="text-xs text-muted-foreground font-mono">
                  {matches.length} matches found
                </div>
              </div>
              <Textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test the regex against..."
                className="min-h-[150px] font-mono bg-background/50 leading-relaxed"
              />
            </CardContent>
          </Card>

          {/* Highlighted Result */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <label className="text-sm font-medium flex items-center gap-2 font-sans">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Result Preview
              </label>
              <div className="min-h-[100px] w-full rounded-lg border border-border bg-background/30 p-4 font-mono whitespace-pre-wrap break-all leading-relaxed">
                {highlightedText}
              </div>
            </CardContent>
          </Card>

          {/* Regex Explanation */}
          <section className="rounded-2xl border border-primary/10 bg-primary/5 p-8">
            <h2 className="mb-4 text-xl font-bold flex items-center gap-2 font-serif">
              <Info className="h-5 w-5 text-primary" />
              Regex Reference
            </h2>
            <div className="grid gap-6 md:grid-cols-2 text-sm font-sans">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Character Classes</h3>
                <ul className="space-y-1 text-muted-foreground list-none p-0">
                  <li><code className="text-foreground bg-muted px-1 rounded">.</code> Any character except newline</li>
                  <li><code className="text-foreground bg-muted px-1 rounded">\\w</code> Word character (a-z, A-Z, 0-9, _)</li>
                  <li><code className="text-foreground bg-muted px-1 rounded">\\d</code> Digit (0-9)</li>
                  <li><code className="text-foreground bg-muted px-1 rounded">\\s</code> Whitespace</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Quantifiers</h3>
                <ul className="space-y-1 text-muted-foreground list-none p-0">
                  <li><code className="text-foreground bg-muted px-1 rounded">*</code> 0 or more</li>
                  <li><code className="text-foreground bg-muted px-1 rounded">+</code> 1 or more</li>
                  <li><code className="text-foreground bg-muted px-1 rounded">?</code> 0 or 1</li>
                  <li><code className="text-foreground bg-muted px-1 rounded">{"{n}"}</code> Exactly n times</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
