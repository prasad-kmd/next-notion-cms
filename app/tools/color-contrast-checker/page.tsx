"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle2, XCircle, ChevronLeft, Info, Palette } from "lucide-react"
import Link from "next/link"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { usePersistentState } from "@/hooks/use-persistent-state"

function getLuminance(hex: string) {
    const rgb = hexToRgb(hex)
    if (!rgb) return 0
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

export default function ColorContrastChecker() {
    const [fgColor, setFgColor] = usePersistentState<string>("contrast-fg", "#3B82F6")
    const [bgColor, setBgColor] = usePersistentState<string>("contrast-bg", "#020617")

    const results = useMemo(() => {
        const l1 = getLuminance(fgColor)
        const l2 = getLuminance(bgColor)
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

        return {
            ratio: ratio.toFixed(2),
            aaNormal: ratio >= 4.5,
            aaLarge: ratio >= 3,
            aaaNormal: ratio >= 7,
            aaaLarge: ratio >= 4.5
        }
    }, [fgColor, bgColor])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Palette className="h-8 w-8 text-fuchsia-500" />
                        Color Contrast Checker
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Verify WCAG 2.1 compliance for foreground and background color combinations.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Color Selection</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fg-color">Foreground Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="fg-color"
                                            type="color"
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value)}
                                            className="w-12 p-1 h-10"
                                        />
                                        <Input
                                            type="text"
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value)}
                                            className="font-mono uppercase"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bg-color">Background Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="bg-color"
                                            type="color"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="w-12 p-1 h-10"
                                        />
                                        <Input
                                            type="text"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="font-mono uppercase"
                                        />
                                    </div>
                                </div>

                                <div
                                    className="mt-6 p-8 rounded-xl border border-border flex items-center justify-center text-center"
                                    style={{ backgroundColor: bgColor, color: fgColor }}
                                >
                                    <div>
                                        <div className="text-2xl font-bold">Preview Text</div>
                                        <div className="text-sm opacity-80 mt-1">This is how the combination looks.</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                The WCAG success criteria ensure that content is accessible to people with moderately low vision. Normal text requires 4.5:1, while large text (18pt+) requires 3:1.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Compliance Results</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-6">
                                <div className="text-center">
                                    <div className="text-xs uppercase text-muted-foreground font-bold mb-2">Contrast Ratio</div>
                                    <div className="text-6xl font-bold text-fuchsia-500 tabular-nums">
                                        {results.ratio}<span className="text-2xl text-muted-foreground font-normal">:1</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <ComplianceRow label="WCAG AA Normal Text" pass={results.aaNormal} />
                                    <ComplianceRow label="WCAG AA Large Text" pass={results.aaLarge} />
                                    <ComplianceRow label="WCAG AAA Normal Text" pass={results.aaaNormal} />
                                    <ComplianceRow label="WCAG AAA Large Text" pass={results.aaaLarge} />
                                </div>

                                <div className="p-4 rounded-lg border border-border/50 bg-background/30 mt-auto">
                                    <h4 className="text-[10px] font-bold uppercase mb-2">Standard Thresholds</h4>
                                    <div className="text-[10px] text-muted-foreground space-y-1">
                                        <p>• AA Normal: 4.5:1</p>
                                        <p>• AA Large: 3:1</p>
                                        <p>• AAA Normal: 7:1</p>
                                        <p>• AAA Large: 4.5:1</p>
                                    </div>
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

function ComplianceRow({ label, pass }: { label: string, pass: boolean }) {
    return (
        <div className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-border/30">
            <span className="text-sm font-medium">{label}</span>
            <div className={`flex items-center gap-2 font-bold ${pass ? "text-green-500" : "text-red-500"}`}>
                {pass ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {pass ? "PASS" : "FAIL"}
            </div>
        </div>
    )
}
