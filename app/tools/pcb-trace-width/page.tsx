"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Cpu, ChevronLeft, Info, Ruler } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIContentIndicator } from "@/components/ai-content-indicator"

export default function PCBTraceWidth() {
    const [current, setCurrent] = useState<string>("1.0")
    const [thickness, setThickness] = useState<string>("1.0") // oz/ft2
    const [tempRise, setTempRise] = useState<string>("10") // deg C
    const [layer, setLayer] = useState<string>("external")

    const result = useMemo(() => {
        const I = parseFloat(current) || 0
        const T = parseFloat(thickness) || 0
        const dT = parseFloat(tempRise) || 0

        if (I <= 0 || T <= 0 || dT <= 0) return null

        // IPC-2221 constants (for area in sq mils)
        const k = layer === "external" ? 0.048 : 0.024
        const b = 0.44
        const c = 0.725

        // Area (A) in sq mils: A = (I / (k * dT^b))^(1/c)
        const A = Math.pow(I / (k * Math.pow(dT, b)), 1 / c)

        // Thickness in mils (1 oz/ft2 approx 1.37 mils)
        const thMils = T * 1.37
        const widthMil = A / thMils
        const widthMm = widthMil * 0.0254

        return {
            area: A.toFixed(2),
            widthMil: widthMil.toFixed(2),
            widthMm: widthMm.toFixed(3)
        }
    }, [current, thickness, tempRise, layer])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Cpu className="h-8 w-8 text-emerald-500" />
                        PCB Trace Width Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Calculate the required trace width for a given current capacity based on IPC-2221 standards.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Input Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current">Target Current (Amps)</Label>
                                    <Input
                                        id="current"
                                        type="number"
                                        value={current}
                                        onChange={(e) => setCurrent(e.target.value)}
                                        placeholder="1.0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="thickness">Copper Thickness (oz/ft²)</Label>
                                    <div className="flex gap-4">
                                        <Input
                                            id="thickness"
                                            type="number"
                                            value={thickness}
                                            onChange={(e) => setThickness(e.target.value)}
                                            placeholder="1.0"
                                        />
                                        <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap italic">
                                            (1 oz = 1.37 mils)
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tempRise">Allowable Temp Rise (°C)</Label>
                                    <Input
                                        id="tempRise"
                                        type="number"
                                        value={tempRise}
                                        onChange={(e) => setTempRise(e.target.value)}
                                        placeholder="10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Trace Location</Label>
                                    <Tabs value={layer} onValueChange={setLayer} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="external">External Layer</TabsTrigger>
                                            <TabsTrigger value="internal">Internal Layer</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                This calculator uses the IPC-2221 (formerly IPC-D-275) formulas to estimate the required trace width.
                                Note that results are estimates and actual performance may vary based on PCB material and environmental factors.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Calculation Results</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-8">
                                <div className="text-center">
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Required Width (mm)</div>
                                    <div className="text-5xl font-bold text-emerald-500 tabular-nums">
                                        {result ? result.widthMm : "--"}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Width (mils)</div>
                                        <div className="text-xl font-semibold tabular-nums">{result ? result.widthMil : "--"}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Area (sq mils)</div>
                                        <div className="text-xl font-semibold tabular-nums">{result ? result.area : "--"}</div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border/50 bg-background/30">
                                    <h4 className="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                        <Ruler className="h-3 w-3" />
                                        Design Margin Recommendation
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground">
                                        It is generally recommended to add a 10-20% margin to the calculated trace width for safety and manufacturing tolerances.
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
