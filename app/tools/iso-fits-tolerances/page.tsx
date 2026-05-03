"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Settings, ChevronLeft, Info, ArrowDownUp } from "lucide-react"
import Link from "next/link"
import { AIContentIndicator } from "@/components/ai-content-indicator"

// Diameter ranges for ISO 286
const RANGES = [3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500]

// IT Grades in microns
const IT_DATA: Record<number, number[]> = {
    6: [6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40],
    7: [10, 12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63],
    8: [14, 18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97],
    9: [25, 30, 36, 43, 52, 62, 74, 87, 100, 115, 130, 140, 155],
}

// Fundamental deviations for shafts (upper deviation es) in microns
const SHAFT_FUND_DEV: Record<string, number[]> = {
    'f': [-6, -10, -13, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68],
    'g': [-2, -4, -5, -6, -7, -9, -10, -12, -14, -15, -17, -18, -20],
    'h': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'p': [6, 12, 15, 18, 22, 26, 32, 37, 43, 50, 56, 62, 68], // Simplified p deviation (lower deviation ei for p)
}

function getRangeIndex(d: number) {
    for (let i = 0; i < RANGES.length; i++) {
        if (d <= RANGES[i]) return i
    }
    return RANGES.length - 1
}

export default function ISOFitsCalculator() {
    const [diameter, setDiameter] = useState<string>("20")
    const [holeClass, setHoleClass] = useState<string>("H7")
    const [shaftClass, setShaftClass] = useState<string>("g6")

    const result = useMemo(() => {
        const d = parseFloat(diameter) || 0
        if (d <= 0 || d > 500) return null

        const idx = getRangeIndex(d)

        // Hole H is always 0 lower deviation
        const holeIT = parseInt(holeClass.substring(1))
        const holeTol = IT_DATA[holeIT]?.[idx] || 0
        const holeMin = 0
        const holeMax = holeTol

        // Shaft
        const shaftLetter = shaftClass.substring(0, 1)
        const shaftIT = parseInt(shaftClass.substring(1))
        const shaftTol = IT_DATA[shaftIT]?.[idx] || 0

        let shaftMin = 0
        let shaftMax = 0

        if (shaftLetter === 'f' || shaftLetter === 'g' || shaftLetter === 'h') {
            // Fundamental deviation is upper deviation (es)
            shaftMax = SHAFT_FUND_DEV[shaftLetter][idx]
            shaftMin = shaftMax - shaftTol
        } else if (shaftLetter === 'p') {
            // Fundamental deviation is lower deviation (ei)
            shaftMin = SHAFT_FUND_DEV[shaftLetter][idx]
            shaftMax = shaftMin + shaftTol
        }

        const maxClearance = holeMax - shaftMin
        const minClearance = holeMin - shaftMax

        let fitType = "Clearance"
        if (minClearance < 0 && maxClearance > 0) fitType = "Transition"
        else if (maxClearance <= 0) fitType = "Interference"

        return {
            hole: { min: holeMin, max: holeMax },
            shaft: { min: shaftMin, max: shaftMax },
            clearance: { min: minClearance, max: maxClearance },
            fitType
        }
    }, [diameter, holeClass, shaftClass])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Settings className="h-8 w-8 text-slate-500" />
                        ISO Fits & Tolerances
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Calculate limits, deviations, and fits for shafts and holes according to ISO 286 standards.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Input Dimensions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="diameter">Nominal Diameter (mm)</Label>
                                    <Input id="diameter" type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="hole">Hole Tolerance</Label>
                                        <select
                                            id="hole"
                                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                                            value={holeClass}
                                            onChange={(e) => setHoleClass(e.target.value)}
                                        >
                                            <option value="H7">H7</option>
                                            <option value="H8">H8</option>
                                            <option value="H9">H9</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shaft">Shaft Tolerance</Label>
                                        <select
                                            id="shaft"
                                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                                            value={shaftClass}
                                            onChange={(e) => setShaftClass(e.target.value)}
                                        >
                                            <option value="f7">f7</option>
                                            <option value="g6">g6</option>
                                            <option value="h6">h6</option>
                                            <option value="p6">p6</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-500/10 border border-slate-500/20 text-[11px] text-slate-300">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                ISO 286 specifies a system of tolerances and fits. <br />
                                <strong>Hole (Uppercase):</strong> H7 is standard for basic hole system. <br />
                                <strong>Shaft (Lowercase):</strong> g6 (sliding), f7 (free running), p6 (press fit).
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Limits & Fit Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-2">Hole Limits (µm)</div>
                                        <div className="text-lg font-bold">+{result?.hole.max} / 0</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-2">Shaft Limits (µm)</div>
                                        <div className="text-lg font-bold">
                                            {result ? (result.shaft.max >= 0 ? "+" : "") + result.shaft.max : "--"} /
                                            {result ? (result.shaft.min >= 0 ? " +" : " ") + result.shaft.min : "--"}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center p-6 bg-background/40 rounded-xl border border-primary/20">
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Fit Type</div>
                                    <div className={`text-3xl font-bold mb-4 ${
                                        result?.fitType === "Clearance" ? "text-emerald-500" :
                                        result?.fitType === "Transition" ? "text-orange-500" : "text-red-500"
                                    }`}>
                                        {result?.fitType || "--"}
                                    </div>

                                    <div className="flex justify-between items-center px-4 py-2 bg-muted/30 rounded-lg text-xs font-mono">
                                        <span>Min: {result?.clearance.min} µm</span>
                                        <ArrowDownUp className="h-3 w-3 opacity-30" />
                                        <span>Max: {result?.clearance.max} µm</span>
                                    </div>
                                </div>

                                <div className="relative h-24 w-full bg-muted/20 rounded flex items-center justify-center overflow-hidden border border-border/30">
                                    {/* Visual Representation */}
                                    <div className="absolute left-1/4 w-1/2 h-16 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-[10px] uppercase font-bold text-muted-foreground/50">
                                        Nominal {diameter}mm
                                    </div>
                                    {/* Hole */}
                                    <div className="absolute top-0 w-full h-8 bg-blue-500/20 border-b-2 border-blue-500 flex items-center justify-center text-[8px] font-bold text-blue-400">HOLE</div>
                                    {/* Shaft */}
                                    <div
                                        className="absolute bg-orange-500/30 border-2 border-orange-500 rounded-sm"
                                        style={{
                                            width: '40%',
                                            height: '24px',
                                            bottom: result ? `${10 + (result.shaft.max / 10)}px` : '10px'
                                        }}
                                    />
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-orange-400">SHAFT</div>
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
