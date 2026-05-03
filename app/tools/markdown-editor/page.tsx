"use client"

import { useState, useEffect } from "react"
import { marked } from "marked"
import DOMPurify from "dompurify"
import { Edit3, Copy, Trash2, Download } from "lucide-react"
import { toast } from "sonner"

export default function MarkdownEditorPage() {
    const [markdown, setMarkdown] = useState("# Welcome to the Markdown Editor\n\nEdit this text to see the preview on the right.")
    const [html, setHtml] = useState("")
    const [view, setView] = useState<"edit" | "preview" | "both">("both")

    useEffect(() => {
        const parseMarkdown = async () => {
            const parsed = await marked(markdown)
            const sanitized = DOMPurify.sanitize(parsed as string)
            setHtml(sanitized)
        }
        parseMarkdown()
    }, [markdown])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdown)
        toast.success("Markdown copied to clipboard!")
    }

    const clearEditor = () => {
        if (confirm("Are you sure you want to clear the editor?")) {
            setMarkdown("")
        }
    }

    const downloadFile = () => {
        const element = document.createElement("a")
        const file = new Blob([markdown], { type: "text/markdown" })
        element.href = URL.createObjectURL(file)
        element.download = "content.md"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    return (
        <div className="min-h-screen flex flex-col p-6 lg:p-8">
            <div className="mx-auto max-w-6xl w-full flex-1 flex flex-col">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-serif flex items-center gap-2">
                            <Edit3 className="h-8 w-8 text-blue-500" />
                            Technical Document Editor
                        </h1>
                        <p className="text-muted-foreground mt-1">High-performance Markdown environment with real-time GitHub-flavored preview and direct export capabilities.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                        <button
                            onClick={() => setView("edit")}
                            className={`px-3 py-1.5 rounded-md text-sm transition-all ${view === "edit" ? "bg-background shadow-sm" : "hover:text-foreground"}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setView("preview")}
                            className={`px-3 py-1.5 rounded-md text-sm transition-all ${view === "preview" ? "bg-background shadow-sm" : "hover:text-foreground"}`}
                        >
                            Preview
                        </button>
                        <button
                            onClick={() => setView("both")}
                            className={`hidden md:block px-3 py-1.5 rounded-md text-sm transition-all ${view === "both" ? "bg-background shadow-sm" : "hover:text-foreground"}`}
                        >
                            Split View
                        </button>
                    </div>
                </div>

                <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                    >
                        <Copy className="h-4 w-4" />
                        Copy
                    </button>
                    <button
                        onClick={downloadFile}
                        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </button>
                    <button
                        onClick={clearEditor}
                        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        Clear
                    </button>
                </div>

                <div className="flex-1 grid gap-6 md:grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                    {(view === "edit" || view === "both") && (
                        <div className={`flex flex-col h-full ${view === "edit" ? "lg:col-span-2" : ""}`}>
                            <textarea
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                placeholder="Type your markdown here..."
                                className="flex-1 w-full p-4 rounded-xl border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[500px]"
                            />
                        </div>
                    )}
                    {(view === "preview" || view === "both") && (
                        <div className={`flex flex-col h-full ${view === "preview" ? "lg:col-span-2" : ""}`}>
                            <div className="flex-1 w-full p-6 rounded-xl border border-border bg-card overflow-auto prose prose-neutral dark:prose-invert max-w-none min-h-[500px]">
                                <div dangerouslySetInnerHTML={{ __html: html }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
