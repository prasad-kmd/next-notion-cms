"use client"

import { useState } from "react"
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { Sigma, Copy, Info } from "lucide-react"
import { toast } from "sonner"

export default function LatexEquationEditorPage() {
    const [latex, setLatex] = useState("x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}")

    const copyToClipboard = () => {
        navigator.clipboard.writeText(latex)
        toast.success("LaTeX copied to clipboard!")
    }

    const examples = [
        { name: "Quadratic Formula", code: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
        { name: "Maxwell's Equations", code: "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}" },
        { name: "Euler's Identity", code: "e^{i\\pi} + 1 = 0" },
        { name: "Schrödinger Equation", code: "i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\hat{H}\\Psi(\\mathbf{r},t)" },
    ]

    return (
        <div className="min-h-screen p-6 lg:p-8 flex flex-col items-center">
            <div className="mx-auto max-w-4xl w-full">
                <div className="mb-8 text-center lg:text-left">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-2 justify-center lg:justify-start">
                        <Sigma className="h-8 w-8 text-pink-500" />
                        Mathematical Formula Architect
                    </h1>
                    <p className="text-muted-foreground mt-1">Advanced LaTeX authoring environment with dynamic block mathematical rendering and formula templates.</p>
                </div>

                <div className="grid gap-6">
                    <div className="p-8 rounded-2xl border border-border bg-card shadow-sm flex items-center justify-center min-h-[200px] overflow-auto">
                        <BlockMath math={latex || "\\text{Type something...}"} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">LaTeX Editor</label>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-3 py-1 bg-muted hover:bg-muted/80 rounded-md text-xs transition-colors"
                            >
                                <Copy className="h-3 w-3" />
                                Copy LaTeX
                            </button>
                        </div>
                        <textarea
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                            placeholder="Enter LaTeX equation..."
                            className="w-full p-4 rounded-xl border border-border bg-card font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[150px]"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-3 block">Examples</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {examples.map((ex) => (
                                <button
                                    key={ex.name}
                                    onClick={() => setLatex(ex.code)}
                                    className="p-3 text-left rounded-lg border border-border bg-muted/20 hover:bg-muted/50 transition-colors text-sm"
                                >
                                    <div className="font-semibold mb-1">{ex.name}</div>
                                    <code className="text-xs text-muted-foreground truncate block">{ex.code}</code>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-xl border border-border text-sm flex gap-3">
                        <Info className="h-5 w-5 text-primary shrink-0" />
                        <div>
                            <p className="font-semibold mb-1">Quick Tips:</p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li>Use <code className="bg-background px-1 rounded">^</code> for exponents and <code className="bg-background px-1 rounded">_</code> for subscripts.</li>
                                <li>Fractions: <code className="bg-background px-1 rounded">\frac{'{'}numerator{'}'}{'{'}denominator{'}'}</code>.</li>
                                <li>Greek letters: <code className="bg-background px-1 rounded">\alpha, \beta, \gamma, \pi</code> etc.</li>
                                <li>Square root: <code className="bg-background px-1 rounded">\sqrt{'{'}expression{'}'}</code>.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
