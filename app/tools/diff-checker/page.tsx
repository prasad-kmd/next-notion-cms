"use client"

import React, { useState, useEffect } from "react"
import { Split, FileText, ChevronRight, Copy, Trash2, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function DiffChecker() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  const [diffResult, setDiffResult] = useState<{ type: "added" | "removed" | "unchanged"; value: string }[][]>([])
  const [isCompared, setIsCompared] = useState(false)

  const handleCompare = () => {
    if (!text1 && !text2) {
      toast.error("Please enter some text to compare")
      return
    }

    const lines1 = text1.split("\n")
    const lines2 = text2.split("\n")

    // Improved basic diff algorithm
    const result: { type: "added" | "removed" | "unchanged"; value: string }[][] = []
    let i = 0, j = 0

    while (i < lines1.length || j < lines2.length) {
      if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
        result.push([{ type: "unchanged", value: lines1[i] }])
        i++
        j++
      } else {
        // Look ahead to find a match
        let foundMatch = false
        for (let lookAhead = 1; lookAhead < 10; lookAhead++) {
           if (i + lookAhead < lines1.length && lines1[i + lookAhead] === lines2[j]) {
              // lines1[i...i+lookAhead-1] were removed
              for (let k = 0; k < lookAhead; k++) {
                 result.push([{ type: "removed", value: lines1[i + k] }])
              }
              i += lookAhead
              foundMatch = true
              break
           }
           if (j + lookAhead < lines2.length && lines1[i] === lines2[j + lookAhead]) {
              // lines2[j...j+lookAhead-1] were added
              for (let k = 0; k < lookAhead; k++) {
                 result.push([{ type: "added", value: lines2[j + k] }])
              }
              j += lookAhead
              foundMatch = true
              break
           }
        }

        if (!foundMatch) {
           if (i < lines1.length && j < lines2.length) {
              result.push([
                { type: "removed", value: lines1[i] },
                { type: "added", value: lines2[j] }
              ])
              i++
              j++
           } else if (i < lines1.length) {
              result.push([{ type: "removed", value: lines1[i] }])
              i++
           } else if (j < lines2.length) {
              result.push([{ type: "added", value: lines2[j] }])
              j++
           }
        }
      }
    }

    setDiffResult(result)
    setIsCompared(true)
    toast.success("Comparison complete")
  }

  const handleClear = () => {
    setText1("")
    setText2("")
    setDiffResult([])
    setIsCompared(false)
  }

  return (
    <div className="min-h-screen pb-20 px-6 lg:px-8 pt-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Split className="h-3 w-3" />
            Engineering Tools
          </div>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 font-serif">Diff Checker</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare two pieces of text or code side-by-side to identify changes, additions, and deletions.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> Original Text
              </label>
              <span className="text-[10px] text-muted-foreground">{text1.length} characters</span>
            </div>
            <Textarea
              placeholder="Paste original text here..."
              className="min-h-[300px] font-mono text-sm bg-card/50 backdrop-blur-sm border-border focus:ring-primary/50"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
             <div className="flex items-center justify-between px-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> Modified Text
              </label>
              <span className="text-[10px] text-muted-foreground">{text2.length} characters</span>
            </div>
            <Textarea
              placeholder="Paste modified text here..."
              className="min-h-[300px] font-mono text-sm bg-card/50 backdrop-blur-sm border-border focus:ring-primary/50"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <Button
            size="lg"
            onClick={handleCompare}
            className="rounded-full px-8 font-bold"
          >
            Compare Text
            <RefreshCw className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleClear}
            className="rounded-full px-8 font-bold"
          >
            Clear All
            <Trash2 className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {isCompared && (
          <Card className="overflow-hidden border-border bg-card/30 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-muted/50 border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Comparison Result
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <div className="h-3 w-3 rounded bg-green-500/20 border border-green-500/50" />
                  <span>Added</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <div className="h-3 w-3 rounded bg-red-500/20 border border-red-500/50" />
                  <span>Removed</span>
                </div>
              </div>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full border-collapse font-mono text-xs sm:text-sm">
                <tbody>
                  {diffResult.map((lineGroups, lineIdx) => (
                    <tr key={lineIdx} className="border-b border-border/50 last:border-0">
                      <td className="w-12 bg-muted/30 text-muted-foreground text-center py-2 select-none border-r border-border/50">
                        {lineIdx + 1}
                      </td>
                      <td className="p-0">
                        {lineGroups.map((diff, i) => (
                          <div
                            key={i}
                            className={`px-4 py-1 whitespace-pre-wrap ${
                              diff.type === "added"
                                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                : diff.type === "removed"
                                ? "bg-red-500/10 text-red-700 dark:text-red-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span className="inline-block w-4 select-none opacity-50">
                              {diff.type === "added" ? "+" : diff.type === "removed" ? "-" : " "}
                            </span>
                            {diff.value || " "}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <div className="mt-20 rounded-2xl border border-border bg-muted/20 p-8">
           <h3 className="text-xl font-bold mb-4 philosopher">How it works</h3>
           <div className="grid gap-6 md:grid-cols-3 text-sm text-muted-foreground">
              <div className="space-y-2">
                 <div className="font-bold text-foreground">Line-by-Line</div>
                 <p>The tool processes each line of text and compares it with the corresponding line in the modified version.</p>
              </div>
              <div className="space-y-2">
                 <div className="font-bold text-foreground">Visual Feedback</div>
                 <p>Additions are highlighted in <span className="text-green-500 font-bold">green</span> and removals in <span className="text-red-500 font-bold">red</span> for quick identification.</p>
              </div>
              <div className="space-y-2">
                 <div className="font-bold text-foreground">Privacy First</div>
                 <p>All comparisons are performed locally in your browser. Your data is never sent to a server.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
