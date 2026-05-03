"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Calculator,
    History,
    Delete,
    Trash2,
    ChevronLeft,
    ArrowRight
} from "lucide-react"
import Link from "next/link"
import { AIContentIndicator } from "@/components/ai-content-indicator"

export default function ScientificCalculator() {
    const [display, setDisplay] = useState("0")
    const [history, setHistory] = useState<string[]>([])
    const [isDeg, setIsDeg] = useState(true)

    const calculate = useCallback(() => {
        try {
            let sanitized = display
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/π/g, "Math.PI")
                .replace(/e/g, "Math.E")
                .replace(/sin\(/g, isDeg ? "Math.sin(Math.PI/180*" : "Math.sin(")
                .replace(/cos\(/g, isDeg ? "Math.cos(Math.PI/180*" : "Math.cos(")
                .replace(/tan\(/g, isDeg ? "Math.tan(Math.PI/180*" : "Math.tan(")
                .replace(/log\(/g, "Math.log10(")
                .replace(/ln\(/g, "Math.log(")
                .replace(/√\(/g, "Math.sqrt(")
                .replace(/\^/g, "**")

            // Count open vs closed parentheses
            const openParen = (sanitized.match(/\(/g) || []).length
            const closeParen = (sanitized.match(/\)/g) || []).length
            if (openParen > closeParen) {
                sanitized += ")".repeat(openParen - closeParen)
            }

            // Use Function instead of eval for slightly better safety and lint compliance
            // eslint-disable-next-line no-new-func
            const res = new Function(`return ${sanitized}`)()
            const resStr = Number.isFinite(res) ?
                (Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(8)).toString())
                : "Error"

            if (resStr !== "Error") {
                setHistory(prev => [display + " = " + resStr, ...prev].slice(0, 10))
                setDisplay(resStr)
            } else {
                setDisplay("Error")
            }
        } catch {
            setDisplay("Error")
        }
    }, [display, isDeg])

    const handleKey = (key: string) => {
        if (display === "0" || display === "Error") {
            if (!["+", "×", "÷", "^", ")"].includes(key)) {
                setDisplay(key)
                return
            }
        }
        setDisplay(prev => prev + key)
    }

    const clear = () => setDisplay("0")
    const backspace = () => {
        if (display.length <= 1 || display === "Error") {
            setDisplay("0")
        } else {
            setDisplay(prev => prev.slice(0, -1))
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === "=") {
                e.preventDefault()
                calculate()
            } else if (e.key === "Backspace") {
                backspace()
            } else if (e.key === "Escape") {
                clear()
            } else if (/[0-9+\-*/().^]/.test(e.key)) {
                let k = e.key
                if (k === "*") k = "×"
                if (k === "/") k = "÷"
                handleKey(k)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [calculate]) // added calculate to dependencies

    const buttons = [
        { label: "sin", action: () => handleKey("sin("), color: "bg-primary/10" },
        { label: "cos", action: () => handleKey("cos("), color: "bg-primary/10" },
        { label: "tan", action: () => handleKey("tan("), color: "bg-primary/10" },
        { label: isDeg ? "DEG" : "RAD", action: () => setIsDeg(!isDeg), color: "bg-amber-500/10 text-amber-500" },
        { label: "log", action: () => handleKey("log("), color: "bg-primary/10" },
        { label: "ln", action: () => handleKey("ln("), color: "bg-primary/10" },
        { label: "√", action: () => handleKey("√("), color: "bg-primary/10" },
        { label: "^", action: () => handleKey("^"), color: "bg-primary/10" },
        { label: "(", action: () => handleKey("("), color: "bg-muted/50" },
        { label: ")", action: () => handleKey(")"), color: "bg-muted/50" },
        { label: "π", action: () => handleKey("π"), color: "bg-muted/50" },
        { label: "e", action: () => handleKey("e"), color: "bg-muted/50" },
        { label: "7", action: () => handleKey("7") },
        { label: "8", action: () => handleKey("8") },
        { label: "9", action: () => handleKey("9") },
        { label: "÷", action: () => handleKey("÷"), color: "text-primary font-bold" },
        { label: "4", action: () => handleKey("4") },
        { label: "5", action: () => handleKey("5") },
        { label: "6", action: () => handleKey("6") },
        { label: "×", action: () => handleKey("×"), color: "text-primary font-bold" },
        { label: "1", action: () => handleKey("1") },
        { label: "2", action: () => handleKey("2") },
        { label: "3", action: () => handleKey("3") },
        { label: "-", action: () => handleKey("-"), color: "text-primary font-bold" },
        { label: "0", action: () => handleKey("0") },
        { label: ".", action: () => handleKey(".") },
        { label: "C", action: clear, color: "text-destructive" },
        { label: "+", action: () => handleKey("+"), color: "text-primary font-bold" },
    ]

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background font-sans">
            <div className="mx-auto max-w-5xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 font-sans">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="mb-4">
                            <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                                <Calculator className="h-8 w-8 text-primary" />
                                Scientific Calculator
                            </h1>
                        </div>

                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
                            <div className="p-6 bg-background/40 border-b border-border/50">
                                <div className="text-right h-24 flex flex-col justify-end overflow-hidden">
                                    <div className="text-muted-foreground text-sm font-mono mb-2 animate-in fade-in slide-in-from-right-4">
                                        {history.length > 0 ? history[0].split("=")[0] : ""}
                                    </div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-foreground truncate">
                                        {display}
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6 grid grid-cols-4 gap-3">
                                {buttons.map((btn, idx) => (
                                    <Button
                                        key={idx}
                                        variant="ghost"
                                        onClick={btn.action}
                                        className={`h-14 md:h-16 text-lg rounded-xl transition-all hover:scale-105 active:scale-95 ${btn.color || "bg-background/40 border border-border/50 hover:bg-primary/5"}`}
                                    >
                                        {btn.label}
                                    </Button>
                                ))}
                                <Button
                                    variant="ghost"
                                    onClick={backspace}
                                    className="h-14 md:h-16 rounded-xl bg-background/40 border border-border/50 text-destructive hover:bg-destructive/10"
                                >
                                    <Delete className="h-5 w-5" />
                                </Button>
                                <Button
                                    onClick={calculate}
                                    className="h-14 md:h-16 col-span-3 text-xl font-bold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    =
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full">
                            <div className="p-4 border-b border-border/50 flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 font-serif">
                                    <History className="h-4 w-4 text-primary" />
                                    Calculation History
                                </h3>
                                <Button variant="ghost" size="icon" onClick={() => setHistory([])} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4 space-y-3 font-mono">
                                {history.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground text-sm italic font-sans">
                                        No recent calculations
                                    </div>
                                ) : (
                                    history.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 rounded-lg bg-background/40 border border-border/50 text-right group cursor-pointer hover:border-primary/30 transition-all animate-in slide-in-from-top-2"
                                            onClick={() => setDisplay(item.split("=")[1].trim())}
                                        >
                                            <div className="text-xs text-muted-foreground mb-1">{item.split("=")[0]}</div>
                                            <div className="text-lg font-bold text-primary">{item.split("=")[1]}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>

                        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 space-y-4">
                            <h4 className="font-bold flex items-center gap-2 text-sm font-serif">
                                <ArrowRight className="h-4 w-4 text-primary" />
                                Operator Guide
                            </h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-muted-foreground font-sans">
                                <div><code className="text-foreground font-bold">^</code> Power (xʸ)</div>
                                <div><code className="text-foreground font-bold">sin/cos</code> Trig Functions</div>
                                <div><code className="text-foreground font-bold">log</code> Base 10 Log</div>
                                <div><code className="text-foreground font-bold">ln</code> Natural Log</div>
                                <div><code className="text-foreground font-bold">√</code> Square Root</div>
                                <div><code className="text-foreground font-bold">π, e</code> Constants</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AIContentIndicator />
        </div>
    )
}
