"use client"

import { useState, useCallback } from "react"
import {
  Braces,
  Copy,
  Trash2,
  Check,
  AlertCircle,
  FileJson,
  Minimize2,
  Maximize2,
  Download,
  Upload,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

export default function JsonFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [spaces, setSpaces] = useState(2)

  const formatJson = useCallback((indent: number = spaces) => {
    if (!input.trim()) {
      setOutput("")
      setError(null)
      return
    }

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indent)
      setOutput(formatted)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setOutput("")
    }
  }, [input, spaces])

  const minifyJson = useCallback(() => {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setOutput("")
    }
  }, [input])

  const handleCopy = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    setIsCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setError(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setInput(text)
    }
    reader.readAsText(file)
  }

  const handleDownload = () => {
    if (!output) return
    const blob = new Blob([output], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formatted.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/tools"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Workspace
          </Link>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                <Braces className="h-8 w-8 text-primary" />
                JSON Structure Validator
              </h1>
              <p className="mt-2 text-muted-foreground">
                Advanced linting, formatting, and validation engine for complex JSON data.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                />
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" /> Import
                </Button>
              </label>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleDownload}
                disabled={!output}
              >
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Input JSON</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Clear
                </Button>
              </div>
            </div>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JSON here..."
                className="min-h-[500px] w-full resize-none bg-transparent p-4 font-mono text-sm outline-none placeholder:text-muted-foreground/50"
              />
            </Card>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => formatJson()} className="gap-2">
                <Maximize2 className="h-4 w-4" /> Format
              </Button>
              <Button variant="secondary" onClick={minifyJson} className="gap-2">
                <Minimize2 className="h-4 w-4" /> Minify
              </Button>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1">
                <span className="text-xs font-medium text-muted-foreground">Indentation:</span>
                <select
                  value={spaces}
                  onChange={(e) => setSpaces(parseInt(e.target.value))}
                  className="bg-transparent text-xs font-bold outline-none"
                >
                  <option value={2}>2 Spaces</option>
                  <option value={4}>4 Spaces</option>
                  <option value={8}>8 Spaces</option>
                </select>
              </div>
            </div>
          </div>

          {/* Output Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Formatted Output</span>
              {output && (
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 text-primary">
                  {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {isCopied ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
            <Card className="relative min-h-[500px] overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
              {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 font-bold text-destructive">Invalid JSON Structure</h3>
                  <p className="max-w-xs text-sm text-muted-foreground font-mono bg-destructive/5 p-4 rounded-lg border border-destructive/20">
                    {error}
                  </p>
                </div>
              ) : output ? (
                <pre className="h-[500px] w-full overflow-auto p-4 font-mono text-sm leading-relaxed">
                  {output}
                </pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  <FileJson className="mb-4 h-12 w-12 opacity-20" />
                  <p>Formatted JSON will appear here</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        <section className="mt-16 rounded-2xl border border-primary/10 bg-primary/5 p-8">
          <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Why use our JSON Validator?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="mb-2 font-semibold">Strict Validation</h3>
              <p className="text-sm text-muted-foreground">
                Uses enterprise-grade parsing to identify missing commas, unquoted keys, and syntax errors.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Custom Formatting</h3>
              <p className="text-sm text-muted-foreground">
                Choose between various indentation levels or minify for production deployment.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Privacy Focused</h3>
              <p className="text-sm text-muted-foreground">
                All processing happens locally in your browser. Your data never leaves your machine.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
