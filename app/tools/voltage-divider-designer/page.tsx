"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Zap, ChevronLeft, Info, Search } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { usePersistentState } from "@/hooks/use-persistent-state"

const E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2]
const E24 = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1]

function getStandardValues(series: number[]) {
    const values: number[] = []
    const decades = [1, 10, 100, 1000, 10000, 100000, 1000000]
    for (const d of decades) {
        for (const s of series) {
            values.push(s * d)
        }
    }
    return values
}

export default function VoltageDividerDesigner() {
    const [vin, setVin] = usePersistentState<string>("vd-vin", "5")
    const [vout, setVout] = usePersistentState<string>("vd-vout", "3.3")
    const [current, setCurrent] = usePersistentState<string>("vd-current", "1") // mA
    const [series, setSeries] = usePersistentState<string>("vd-series", "E24")

    const results = useMemo(() => {
        const Vi = parseFloat(vin) || 0
        const Vo = parseFloat(vout) || 0
        const ImA = parseFloat(current) || 0

        if (Vi <= 0 || Vo <= 0 || Vo >= Vi) return null

        const I = ImA / 1000
        // Rtotal = Vi / I
        // Vo = Vi * R2 / (R1 + R2)
        // R2 = Vo * Rtotal / Vi
        // R1 = Rtotal - R2

        const Rtotal = Vi / (I || 0.001) // default to 1mA if current is 0 for initial calc
        const R2_ideal = (Vo * Rtotal) / Vi
        const R1_ideal = Rtotal - R2_ideal

        const seriesValues = series === "E12" ? getStandardValues(E12) : getStandardValues(E24)

        // Find best combination
        let bestR1 = 0
        let bestR2 = 0
        let minError = Infinity

        // Narrow down candidates to speed up search
        const findNearest = (val: number) => {
            return seriesValues.reduce((prev, curr) =>
                Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
            )
        }

        const r1Candidates = [findNearest(R1_ideal)]
        const r2Candidates = [findNearest(R2_ideal)]

        // Add neighbors
        const idx1 = seriesValues.indexOf(r1Candidates[0])
        if (idx1 > 0) r1Candidates.push(seriesValues[idx1-1])
        if (idx1 < seriesValues.length - 1) r1Candidates.push(seriesValues[idx1+1])

        const idx2 = seriesValues.indexOf(r2Candidates[0])
        if (idx2 > 0) r2Candidates.push(seriesValues[idx2-1])
        if (idx2 < seriesValues.length - 1) r2Candidates.push(seriesValues[idx2+1])

        for (const r1 of r1Candidates) {
            for (const r2 of r2Candidates) {
                const actualVo = Vi * (r2 / (r1 + r2))
                const error = Math.abs(actualVo - Vo)
                if (error < minError) {
                    minError = error
                    bestR1 = r1
                    bestR2 = r2
                }
            }
        }

        const finalVo = Vi * (bestR2 / (bestR1 + bestR2))
        const finalI = Vi / (bestR1 + bestR2)

        return {
            r1: bestR1 >= 1000 ? (bestR1/1000).toFixed(2) + " kΩ" : bestR1.toFixed(1) + " Ω",
            r2: bestR2 >= 1000 ? (bestR2/1000).toFixed(2) + " kΩ" : bestR2.toFixed(1) + " Ω",
            vout: finalVo.toFixed(3),
            error: ((Math.abs(finalVo - Vo) / Vo) * 100).toFixed(2),
            current: (finalI * 1000).toFixed(2)
        }
    }, [vin, vout, current, series])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Search className="h-8 w-8 text-blue-500" />
                        Voltage Divider Designer
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Find the best standard resistor values (E12/E24) for your desired output voltage.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Design Requirements</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="vin">Input Voltage (Vin)</Label>
                                        <Input
                                            id="vin"
                                            type="number"
                                            value={vin}
                                            onChange={(e) => setVin(e.target.value)}
                                            placeholder="5.0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vout">Desired Vout</Label>
                                        <Input
                                            id="vout"
                                            type="number"
                                            value={vout}
                                            onChange={(e) => setVout(e.target.value)}
                                            placeholder="3.3"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="current">Target Current (mA)</Label>
                                    <Input
                                        id="current"
                                        type="number"
                                        value={current}
                                        onChange={(e) => setCurrent(e.target.value)}
                                        placeholder="1.0"
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">
                                        Sets the impedance level of the divider.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Resistor Series</Label>
                                    <Tabs value={series} onValueChange={setSeries} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="E12">E12 (10%)</TabsTrigger>
                                            <TabsTrigger value="E24">E24 (5%)</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                This tool searches through standard resistor series to find the pair that most closely matches your target output voltage while staying near your target current.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Recommended Components</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-xl bg-background/50 border border-border/50 text-center">
                                        <div className="text-xs uppercase text-muted-foreground font-bold mb-1">R1 (Top)</div>
                                        <div className="text-2xl font-bold text-blue-500 tabular-nums">{results ? results.r1 : "--"}</div>
                                    </div>
                                    <div className="p-6 rounded-xl bg-background/50 border border-border/50 text-center">
                                        <div className="text-xs uppercase text-muted-foreground font-bold mb-1">R2 (Bottom)</div>
                                        <div className="text-2xl font-bold text-blue-500 tabular-nums">{results ? results.r2 : "--"}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-border/30">
                                        <span className="text-sm text-muted-foreground">Actual Vout:</span>
                                        <span className="font-mono font-bold">{results ? results.vout : "--"} V</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-border/30">
                                        <span className="text-sm text-muted-foreground">Voltage Error:</span>
                                        <span className={`font-mono font-bold ${parseFloat(results?.error || "0") > 1 ? "text-red-400" : "text-green-400"}`}>
                                            {results ? results.error : "--"}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-border/30">
                                        <span className="text-sm text-muted-foreground">Actual Current:</span>
                                        <span className="font-mono font-bold">{results ? results.current : "--"} mA</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border/50 bg-background/30 mt-auto">
                                    <h4 className="text-[10px] font-bold uppercase mb-2 flex items-center gap-2">
                                        <Zap className="h-3 w-3" />
                                        Power Dissipation
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground">
                                        Ensure your resistors can handle the power: P = V²/R. For a {vin}V input, total power is {(parseFloat(vin)**2 / ( (parseFloat(results?.r1 || "0") + parseFloat(results?.r2 || "0")) || 1 )).toFixed(4)}W.
                                    </p>
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
