"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Ruler, ChevronLeft, Info, FileCode } from "lucide-react"
import Link from "next/link"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { usePersistentState } from "@/hooks/use-persistent-state"

export default function CSSUnitConverter() {
    const [pxValue, setPxValue] = usePersistentState<string>("css-px", "16")
    const [baseSize, setBaseSize] = usePersistentState<string>("css-base", "16")
    const [viewportWidth, setViewportWidth] = usePersistentState<string>("css-vw", "1920")
    const [viewportHeight, setViewportHeight] = usePersistentState<string>("css-vh", "1080")

    const results = useMemo(() => {
        const px = parseFloat(pxValue) || 0
        const base = parseFloat(baseSize) || 16
        const vw = parseFloat(viewportWidth) || 1920
        const vh = parseFloat(viewportHeight) || 1080

        return {
            rem: (px / base).toFixed(3),
            em: (px / base).toFixed(3),
            percent: ((px / base) * 100).toFixed(1),
            vw: ((px / vw) * 100).toFixed(3),
            vh: ((px / vh) * 100).toFixed(3)
        }
    }, [pxValue, baseSize, viewportWidth, viewportHeight])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <FileCode className="h-8 w-8 text-sky-500" />
                        CSS Unit Converter
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Convert between pixels (px), rem, em, percentage, and viewport units for responsive web development.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Input Value</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="px-input">Pixel Value (px)</Label>
                                    <Input
                                        id="px-input"
                                        type="number"
                                        value={pxValue}
                                        onChange={(e) => setPxValue(e.target.value)}
                                        className="text-2xl h-14 font-bold text-sky-500"
                                    />
                                </div>

                                <div className="pt-4 border-t border-border/50 space-y-4">
                                    <Label className="text-xs uppercase text-muted-foreground font-bold">Context Settings</Label>
                                    <div className="space-y-2">
                                        <Label htmlFor="base-size">Base Font Size (px)</Label>
                                        <Input id="base-size" type="number" value={baseSize} onChange={(e) => setBaseSize(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="vw-size">Viewport Width</Label>
                                            <Input id="vw-size" type="number" value={viewportWidth} onChange={(e) => setViewportWidth(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="vh-size">Viewport Height</Label>
                                            <Input id="vh-size" type="number" value={viewportHeight} onChange={(e) => setViewportHeight(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                <strong>rem</strong> units are relative to the root HTML font size. <strong>em</strong> units are relative to the parent element font size. <strong>vw/vh</strong> are relative to 1% of the viewport width/height.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Converted Units</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex justify-between items-center">
                                        <span className="text-sm font-bold text-muted-foreground uppercase">rem</span>
                                        <span className="text-2xl font-bold tabular-nums font-mono">{results.rem} rem</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex justify-between items-center">
                                        <span className="text-sm font-bold text-muted-foreground uppercase">Percentage</span>
                                        <span className="text-2xl font-bold tabular-nums font-mono">{results.percent}%</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex justify-between items-center">
                                        <span className="text-sm font-bold text-muted-foreground uppercase">vw (Viewport Width)</span>
                                        <span className="text-2xl font-bold tabular-nums font-mono">{results.vw} vw</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex justify-between items-center">
                                        <span className="text-sm font-bold text-muted-foreground uppercase">vh (Viewport Height)</span>
                                        <span className="text-2xl font-bold tabular-nums font-mono">{results.vh} vh</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border/50 bg-background/30 mt-auto">
                                    <h4 className="text-[10px] font-bold uppercase mb-2 flex items-center gap-2">
                                        <Ruler className="h-3 w-3" />
                                        CSS Example
                                    </h4>
                                    <pre className="text-[10px] font-mono p-2 bg-background/50 rounded overflow-x-auto text-sky-300">
                                        {`.element {\n  width: ${results.vw}vw;\n  font-size: ${results.rem}rem;\n  padding: ${results.vh}vh;\n}`}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <AIContentIndicator />
        </div>
    )
}
