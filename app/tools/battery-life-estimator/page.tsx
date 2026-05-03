"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Battery, ChevronLeft, Info, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { InlineMath, BlockMath } from "react-katex"
import "katex/dist/katex.min.css"

export default function BatteryLifeEstimator() {
    const [capacity, setCapacity] = useState<string>("2500") // mAh
    const [consumption, setConsumption] = useState<string>("200") // mA
    const [safetyMargin, setSafetyMargin] = useState<string>("20") // %
    const [isPeukert, setIsPeukert] = useState<boolean>(false)
    const [peukertExp, setPeukertExp] = useState<string>("1.1")

    const result = useMemo(() => {
        const C = parseFloat(capacity) || 0
        const I = parseFloat(consumption) || 0
        const S = parseFloat(safetyMargin) || 0
        const k = parseFloat(peukertExp) || 1.1

        if (C <= 0 || I <= 0) return null

        let hours = 0
        if (isPeukert) {
            // Simplified Peukert's Law: t = H * (C / (I * H))^k
            // Assuming C is rated at 20h (H=20)
            const H = 20
            hours = H * Math.pow(C / (I * H), k)
        } else {
            hours = C / I
        }

        const safetyAdjusted = hours * (1 - S / 100)

        const totalMinutes = safetyAdjusted * 60
        const h = Math.floor(safetyAdjusted)
        const m = Math.floor(totalMinutes % 60)

        return {
            hours: safetyAdjusted.toFixed(2),
            formatted: `${h}h ${m}m`,
            days: (safetyAdjusted / 24).toFixed(1)
        }
    }, [capacity, consumption, safetyMargin, isPeukert, peukertExp])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Battery className="h-8 w-8 text-green-500" />
                        Battery Life Estimator
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Estimate battery runtime based on capacity and load current with optional Peukert&apos;s Law compensation.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Battery & Load</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Battery Capacity (mAh)</Label>
                                    <Input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="load">Average Load Current (mA)</Label>
                                    <Input id="load" type="number" value={consumption} onChange={(e) => setConsumption(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="safety">Safety Margin (%)</Label>
                                    <Input id="safety" type="number" value={safetyMargin} onChange={(e) => setSafetyMargin(e.target.value)} />
                                    <p className="text-[10px] text-muted-foreground italic">Recommended: 20% to avoid deep discharge.</p>
                                </div>

                                <div className="pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-2 mb-4">
                                        <input
                                            type="checkbox"
                                            id="peukert"
                                            checked={isPeukert}
                                            onChange={(e) => setIsPeukert(e.target.checked)}
                                            className="rounded border-input bg-background"
                                        />
                                        <Label htmlFor="peukert" className="text-sm font-semibold cursor-pointer">Enable Peukert&apos;s Law</Label>
                                    </div>

                                    {isPeukert && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Label htmlFor="pk">Peukert Exponent (k)</Label>
                                            <Input id="pk" type="number" value={peukertExp} onChange={(e) => setPeukertExp(e.target.value)} step="0.01" />
                                            <p className="text-[10px] text-muted-foreground">Typically 1.05 to 1.3 for Lead Acid. Lithium is closer to 1.0.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-[11px] text-green-200">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <div className="flex-1">
                            <p className="font-semibold mb-2 text-xs">
                                Standard calculation: </p>
                                <div className="space-y-2 text-xl">
                      <div><InlineMath math="\text{T}=\frac{\text{Capacity}}{\text{Current}}"/></div></div>
                                <br/>
                                <p className="font-semibold text-xs">
                                Peukert&apos;s Law accounts for the fact that battery capacity decreases as the rate of discharge increases.
                            </p></div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Estimated Runtime</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-10">
                                <div className="text-center">
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Time</div>
                                    <div className="text-6xl font-bold text-green-500 tabular-nums">
                                        {result ? result.formatted : "--"}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        ({result?.hours} decimal hours)
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center flex flex-col items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold">Days</div>
                                        <div className="text-xl font-semibold tabular-nums">{result?.days || "--"}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center flex flex-col items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold">Reserve</div>
                                        <div className="text-xl font-semibold tabular-nums">{safetyMargin}%</div>
                                    </div>
                                </div>

                                <div className="relative w-full h-8 bg-muted/30 rounded-full overflow-hidden border border-border/50">
                                    <div
                                        className="h-full bg-green-500/50 transition-all duration-1000"
                                        style={{ width: `${100 - parseFloat(safetyMargin)}%` }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                                        Usable Capacity
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
