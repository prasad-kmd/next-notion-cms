"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Zap, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const COLORS = [
    { name: "Black", color: "bg-black", hex: "#000000", value: 0, multiplier: 1, tolerance: null, tempCoeff: 250 },
    { name: "Brown", color: "bg-amber-900", hex: "#78350f", value: 1, multiplier: 10, tolerance: 1, tempCoeff: 100 },
    { name: "Red", color: "bg-red-600", hex: "#dc2626", value: 2, multiplier: 100, tolerance: 2, tempCoeff: 50 },
    { name: "Orange", color: "bg-orange-500", hex: "#f97316", value: 3, multiplier: 1000, tolerance: null, tempCoeff: 15 },
    { name: "Yellow", color: "bg-yellow-400", hex: "#facc15", value: 4, multiplier: 10000, tolerance: null, tempCoeff: 25 },
    { name: "Green", color: "bg-green-600", hex: "#16a34a", value: 5, multiplier: 100000, tolerance: 0.5, tempCoeff: 20 },
    { name: "Blue", color: "bg-blue-600", hex: "#2563eb", value: 6, multiplier: 1000000, tolerance: 0.25, tempCoeff: 10 },
    { name: "Violet", color: "bg-violet-500", hex: "#8b5cf6", value: 7, multiplier: 10000000, tolerance: 0.1, tempCoeff: 5 },
    { name: "Grey", color: "bg-gray-500", hex: "#6b7280", value: 8, multiplier: 100000000, tolerance: 0.05, tempCoeff: 1 },
    { name: "White", color: "bg-white", hex: "#ffffff", value: 9, multiplier: 1000000000, tolerance: null, tempCoeff: null },
    { name: "Gold", color: "bg-yellow-600", hex: "#ca8a04", value: null, multiplier: 0.1, tolerance: 5, tempCoeff: null },
    { name: "Silver", color: "bg-gray-300", hex: "#d1d5db", value: null, multiplier: 0.01, tolerance: 10, tempCoeff: null },
]

export default function ResistorColorCode() {
    const [bands, setBands] = useState<number>(4)
    const [selectedColors, setSelectedColors] = useState<number[]>([1, 0, 2, 10, 0, 0]) // Indices into COLORS

    const handleColorChange = (bandIndex: number, colorIndex: number) => {
        const newColors = [...selectedColors]
        newColors[bandIndex] = colorIndex
        setSelectedColors(newColors)
    }

    const result = useMemo(() => {
        let resistance = 0
        let tolerance = 0
        let tempCoeff = null

        if (bands === 4) {
            const d1 = COLORS[selectedColors[0]].value ?? 0
            const d2 = COLORS[selectedColors[1]].value ?? 0
            const mult = COLORS[selectedColors[2]].multiplier
            resistance = (d1 * 10 + d2) * mult
            tolerance = COLORS[selectedColors[3]].tolerance ?? 0
        } else if (bands === 5) {
            const d1 = COLORS[selectedColors[0]].value ?? 0
            const d2 = COLORS[selectedColors[1]].value ?? 0
            const d3 = COLORS[selectedColors[2]].value ?? 0
            const mult = COLORS[selectedColors[3]].multiplier
            resistance = (d1 * 100 + d2 * 10 + d3) * mult
            tolerance = COLORS[selectedColors[4]].tolerance ?? 0
        } else if (bands === 6) {
            const d1 = COLORS[selectedColors[0]].value ?? 0
            const d2 = COLORS[selectedColors[1]].value ?? 0
            const d3 = COLORS[selectedColors[2]].value ?? 0
            const mult = COLORS[selectedColors[3]].multiplier
            resistance = (d1 * 100 + d2 * 10 + d3) * mult
            tolerance = COLORS[selectedColors[4]].tolerance ?? 0
            tempCoeff = COLORS[selectedColors[5]].tempCoeff
        }

        let formattedRes = ""
        if (resistance >= 1000000) formattedRes = (resistance / 1000000).toFixed(2) + " MΩ"
        else if (resistance >= 1000) formattedRes = (resistance / 1000).toFixed(2) + " kΩ"
        else formattedRes = resistance.toFixed(2) + " Ω"

        return { formattedRes, tolerance, tempCoeff }
    }, [bands, selectedColors])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Zap className="h-8 w-8 text-amber-500" />
                        Resistor Color Code Solver
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Interactive visual calculator for 4, 5, and 6-band resistors. Select colors to decode the resistance value.
                    </p>
                </div>

                <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <Tabs defaultValue="4" onValueChange={(v) => setBands(parseInt(v))}>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Resistor Configuration</CardTitle>
                                <TabsList>
                                    <TabsTrigger value="4">4 Bands</TabsTrigger>
                                    <TabsTrigger value="5">5 Bands</TabsTrigger>
                                    <TabsTrigger value="6">6 Bands</TabsTrigger>
                                </TabsList>
                            </div>
                        </Tabs>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        {/* Visual Resistor */}
                        <div className="relative w-full max-w-md h-32 bg-muted/20 rounded-full flex items-center justify-center mb-12 border border-border/50">
                            {/* Resistor Body */}
                            <div className="absolute w-[80%] h-12 bg-[#d1b08c] rounded-lg shadow-inner flex items-center justify-between px-4 overflow-hidden">
                                {Array.from({ length: bands }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-full w-4 shadow-sm transition-colors duration-300",
                                            COLORS[selectedColors[i]].color
                                        )}
                                        style={{
                                            marginLeft: i === bands - 1 ? 'auto' : (i === 0 ? '0' : '8px'),
                                            order: i
                                        }}
                                    />
                                ))}
                            </div>
                            {/* Resistor Leads */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[10%] h-1 bg-gray-400 -z-10" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[10%] h-1 bg-gray-400 -z-10" />
                        </div>

                        {/* Result Display */}
                        <div className="text-center p-6 bg-primary/5 rounded-xl border border-primary/20 w-full max-w-sm">
                            <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-1">Total Resistance</div>
                            <div className="text-4xl font-bold text-primary tabular-nums">
                                {result.formattedRes}
                            </div>
                            <div className="mt-2 flex items-center justify-center gap-4 text-sm font-semibold">
                                <span className="px-2 py-1 rounded bg-muted/50">±{result.tolerance}% Tolerance</span>
                                {result.tempCoeff && <span className="px-2 py-1 rounded bg-muted/50">{result.tempCoeff} ppm/K</span>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: bands }).map((_, bandIdx) => (
                        <Card key={bandIdx} className="border-border/50 bg-card/30">
                            <CardContent className="p-4">
                                <Label className="text-xs font-bold uppercase text-muted-foreground mb-3 block">
                                    Band {bandIdx + 1}: {bandIdx < (bands === 4 ? 2 : 3) ? "Digit" : bandIdx === (bands === 4 ? 2 : 3) ? "Multiplier" : bandIdx === (bands === 4 ? 3 : 4) ? "Tolerance" : "Temp Coeff"}
                                </Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {COLORS.map((c, colorIdx) => {
                                        // Disable options that don't make sense for certain bands
                                        const isDisabled =
                                            (bandIdx < (bands === 4 ? 2 : 3) && c.value === null) ||
                                            (bandIdx === (bands === 4 ? 2 : 3) && c.multiplier === null) ||
                                            (bandIdx === (bands === 4 ? 3 : 4) && c.tolerance === null) ||
                                            (bandIdx === 5 && c.tempCoeff === null);

                                        if (isDisabled) return null;

                                        return (
                                            <button
                                                key={colorIdx}
                                                onClick={() => handleColorChange(bandIdx, colorIdx)}
                                                className={cn(
                                                    "h-8 rounded-md border border-border flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative",
                                                    c.color,
                                                    selectedColors[bandIdx] === colorIdx ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-80 grayscale-[0.2] hover:grayscale-0 hover:opacity-100"
                                                )}
                                                title={c.name}
                                            >
                                                {c.name === "White" && <div className="w-1 h-1 bg-black rounded-full opacity-20" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
