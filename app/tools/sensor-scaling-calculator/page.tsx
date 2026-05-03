"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Ruler, ChevronLeft, Info, Scale } from "lucide-react"
import Link from "next/link"
import { AIContentIndicator } from "@/components/ai-content-indicator"

export default function SensorScalingCalculator() {
    const [inMin, setInMin] = useState<string>("0.0")
    const [inMax, setInMax] = useState<string>("5.0")
    const [outMin, setOutMin] = useState<string>("0.0")
    const [outMax, setOutMax] = useState<string>("100.0")
    const [inputValue, setInputValue] = useState<string>("2.5")

    const result = useMemo(() => {
        const x1 = parseFloat(inMin) || 0
        const x2 = parseFloat(inMax) || 0
        const y1 = parseFloat(outMin) || 0
        const y2 = parseFloat(outMax) || 0
        const x = parseFloat(inputValue) || 0

        if (x1 === x2) return null

        const slope = (y2 - y1) / (x2 - x1)
        const y = y1 + slope * (x - x1)

        return {
            scaled: y.toFixed(4),
            slope: slope.toFixed(4),
            offset: (y1 - slope * x1).toFixed(4)
        }
    }, [inMin, inMax, outMin, outMax, inputValue])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Ruler className="h-8 w-8 text-lime-500" />
                        Sensor Scaling Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Map analog input ranges (voltage, current, ADC counts) to physical engineering units for sensor calibration.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Input Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Input Min (X1)</Label>
                                        <Input type="number" value={inMin} onChange={(e) => setInMin(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Input Max (X2)</Label>
                                        <Input type="number" value={inMax} onChange={(e) => setInMax(e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Engineering Min (Y1)</Label>
                                        <Input type="number" value={outMin} onChange={(e) => setOutMin(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Engineering Max (Y2)</Label>
                                        <Input type="number" value={outMax} onChange={(e) => setOutMax(e.target.value)} />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border/50">
                                    <Label className="text-xs font-bold uppercase mb-2 block">Test Input Value</Label>
                                    <Input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="text-lg font-mono border-primary/30"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-lime-500/10 border border-lime-500/20 text-[11px] text-lime-200">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                Uses linear interpolation (y = mx + b). <br />
                                <strong>Slope (m):</strong> (Y2 - Y1) / (X2 - X1) <br />
                                <strong>Offset (b):</strong> Y1 - m * X1
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Calculated Mapping</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-12">
                                <div className="text-center">
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Scaled Engineering Value</div>
                                    <div className="text-6xl font-bold text-lime-500 tabular-nums">
                                        {result?.scaled || "--"}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Scaling Slope (m)</div>
                                        <div className="text-xl font-semibold tabular-nums">{result?.slope || "--"}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Zero Offset (b)</div>
                                        <div className="text-xl font-semibold tabular-nums">{result?.offset || "--"}</div>
                                    </div>
                                </div>

                                <div className="p-6 bg-background/40 rounded-xl border border-primary/20">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase mb-4 text-muted-foreground">
                                        <Scale className="h-3.5 w-3.5" />
                                        Visual Scale
                                    </div>
                                    <div className="relative h-2 w-full bg-muted rounded-full">
                                        <div
                                            className="absolute h-4 w-1 bg-lime-500 top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(132,204,22,0.5)] transition-all duration-300"
                                            style={{
                                                left: result ? `${Math.min(100, Math.max(0, (parseFloat(inputValue) - parseFloat(inMin)) / (parseFloat(inMax) - parseFloat(inMin)) * 100))}%` : '50%'
                                            }}
                                        />
                                        <div className="absolute -bottom-6 left-0 text-[10px] text-muted-foreground font-mono">{inMin}</div>
                                        <div className="absolute -bottom-6 right-0 text-[10px] text-muted-foreground font-mono">{inMax}</div>
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
