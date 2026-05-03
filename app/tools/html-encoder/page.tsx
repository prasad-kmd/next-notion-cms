"use client"

import { useState } from "react"
import { Code2, Copy, Replace } from "lucide-react"
import { toast } from "sonner"

export default function HtmlEncoderPage() {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")

    const encodeHtml = (str: string) => {
        return str.replace(/[&<>"']/g, function (m) {
            switch (m) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#039;';
                default: return m;
            }
        });
    };

    const decodeHtml = (str: string) => {
        if (typeof window !== "undefined") {
            const doc = new DOMParser().parseFromString(str, "text/html");
            return doc.documentElement.textContent || "";
        }
        return str;
    };

    const handleEncode = () => {
        setOutput(encodeHtml(input))
    }

    const handleDecode = () => {
        setOutput(decodeHtml(input))
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output)
        toast.success("Result copied to clipboard!")
    }

    return (
        <div className="min-h-screen p-6 lg:p-8 flex flex-col items-center">
            <div className="mx-auto max-w-4xl w-full">
                <div className="mb-8 text-center lg:text-left">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-2 justify-center lg:justify-start">
                        <Code2 className="h-8 w-8 text-orange-500" />
                        Security & Syntax Escaper
                    </h1>
                    <p className="text-muted-foreground mt-1">Enterprise-grade HTML entity encoder/decoder designed for secure code presentation and XSS prevention.</p>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Input</label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your text or HTML here..."
                            className="w-full p-4 rounded-xl border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[200px]"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={handleEncode}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Encode HTML
                        </button>
                        <button
                            onClick={handleDecode}
                            className="px-6 py-2 bg-muted border border-border rounded-lg font-semibold hover:bg-muted/80 transition-colors"
                        >
                            Decode HTML
                        </button>
                        <button
                            onClick={() => {
                                const temp = input;
                                setInput(output);
                                setOutput(temp);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Replace className="h-4 w-4" />
                            Swap
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Output</label>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-3 py-1 bg-muted hover:bg-muted/80 rounded-md text-xs transition-colors"
                            >
                                <Copy className="h-3 w-3" />
                                Copy Output
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            className="w-full p-4 rounded-xl border border-border bg-muted/30 font-mono text-sm focus:outline-none min-h-[200px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
