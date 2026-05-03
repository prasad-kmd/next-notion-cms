"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Cpu, ChevronLeft, Info, Zap } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { usePersistentState } from "@/hooks/use-persistent-state"

export default function PCBImpedanceCalculator() {
    const [type, setType] = usePersistentState<string>("pcb-imp-type", "microstrip")
    const [dielectric, setDielectric] = usePersistentState<string>("pcb-imp-er", "4.4") // FR-4
    const [height, setHeight] = usePersistentState<string>("pcb-imp-h", "1.6") // mm
    const [width, setWidth] = usePersistentState<string>("pcb-imp-w", "0.5") // mm
    const [thickness, setThickness] = usePersistentState<string>("pcb-imp-t", "0.035") // mm (1 oz)

    const result = useMemo(() => {
        const er = parseFloat(dielectric) || 0
        const h = parseFloat(height) || 0
        const w = parseFloat(width) || 0
        const t = parseFloat(thickness) || 0

        if (er <= 0 || h <= 0 || w <= 0) return null

        let z0 = 0
        if (type === "microstrip") {
            // IPC-2141 Microstrip formula
            // Z0 = (87 / sqrt(er + 1.41)) * ln(5.98h / (0.8w + t))
            z0 = (87 / Math.sqrt(er + 1.41)) * Math.log((5.98 * h) / (0.8 * w + t))
        } else {
            // IPC-2141 Stripline formula
            // Z0 = (60 / sqrt(er)) * ln(1.9h / (0.8w + t))
            z0 = (60 / Math.sqrt(er)) * Math.log((1.9 * h) / (0.8 * w + t))
        }

        if (z0 < 0 || isNaN(z0)) return null

        return {
            z0: z0.toFixed(2),
        }
    }, [type, dielectric, height, width, thickness])

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
                        PCB Impedance Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Calculate microstrip and stripline characteristic impedance for high-speed PCB design.
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
                                    <Label>Transmission Line Type</Label>
                                    <Tabs value={type} onValueChange={setType} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="microstrip">Microstrip</TabsTrigger>
                                            <TabsTrigger value="stripline">Stripline</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dielectric">Dielectric Constant (εᵣ)</Label>
                                    <div className="flex gap-4">
                                        <Input
                                            id="dielectric"
                                            type="number"
                                            value={dielectric}
                                            onChange={(e) => setDielectric(e.target.value)}
                                            placeholder="4.4"
                                        />
                                        <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap italic">
                                            (FR-4 ≈ 4.4)
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="height">Dielectric Height (h) [mm]</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        placeholder="1.6"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="width">Trace Width (w) [mm]</Label>
                                    <Input
                                        id="width"
                                        type="number"
                                        value={width}
                                        onChange={(e) => setWidth(e.target.value)}
                                        placeholder="0.5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="thickness">Trace Thickness (t) [mm]</Label>
                                    <div className="flex gap-4">
                                        <Input
                                            id="thickness"
                                            type="number"
                                            value={thickness}
                                            onChange={(e) => setThickness(e.target.value)}
                                            placeholder="0.035"
                                        />
                                        <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap italic">
                                            (1 oz ≈ 0.035mm)
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold mb-1">Formula Info:</p>
                                <p>
                                    Uses IPC-2141 standard approximations. These formulas are generally accurate when:
                                </p>
                                <ul className="list-disc ml-4 mt-1 space-y-0.5">
                                    <li>0.1 &lt; w/h &lt; 3.0</li>
                                    <li>1 &lt; εᵣ &lt; 15</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Characteristic Impedance</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-8">
                                <div className="text-center">
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Impedance (Z₀)</div>
                                    <div className="text-6xl font-bold text-amber-500 tabular-nums">
                                        {result ? result.z0 : "--"} <span className="text-2xl text-muted-foreground font-normal">Ω</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border/50 bg-background/30">
                                    <h4 className="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                        <Cpu className="h-3 w-3" />
                                        Design Context
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground">
                                        Standard high-speed designs usually target 50Ω for single-ended signals and 100Ω for differential pairs. Adjust width or height to match your target impedance.
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
