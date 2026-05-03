"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Activity, ChevronLeft, Info, Zap } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIContentIndicator } from "@/components/ai-content-indicator"

export default function OpAmpGainCalculator() {
    const [mode, setMode] = useState<string>("non-inverting")
    const [r1, setR1] = useState<string>("1") // kOhm
    const [rf, setRf] = useState<string>("10") // kOhm
    const [vin, setVin] = useState<string>("1.0") // V

    const result = useMemo(() => {
        const R1 = parseFloat(r1) || 0
        const Rf = parseFloat(rf) || 0
        const Vi = parseFloat(vin) || 0

        if (R1 <= 0) return null

        let gain = 0
        if (mode === "non-inverting") {
            gain = 1 + (Rf / R1)
        } else {
            gain = -(Rf / R1)
        }

        const vout = Vi * gain

        return {
            gain: gain.toFixed(2),
            vout: vout.toFixed(2)
        }
    }, [mode, r1, rf, vin])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Activity className="h-8 w-8 text-red-500" />
                        Op-Amp Gain Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Calculate gain and output voltage for Inverting and Non-Inverting operational amplifier circuits.
                    </p>
                </div>

                <Tabs value={mode} onValueChange={setMode} className="w-full space-y-8">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                        <TabsTrigger value="non-inverting">Non-Inverting</TabsTrigger>
                        <TabsTrigger value="inverting">Inverting</TabsTrigger>
                    </TabsList>

                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="space-y-6">
                            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Resistor Values</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="r1">Input Resistor R1 (kΩ)</Label>
                                        <Input id="r1" type="number" value={r1} onChange={(e) => setR1(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rf">Feedback Resistor Rf (kΩ)</Label>
                                        <Input id="rf" type="number" value={rf} onChange={(e) => setRf(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vin">Input Voltage Vin (V)</Label>
                                        <Input id="vin" type="number" value={vin} onChange={(e) => setVin(e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] text-red-200">
                                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">Gain Formula:</p>
                                    {mode === "non-inverting" ? (
                                        <p>Gain (Av) = 1 + (Rf / R1)</p>
                                    ) : (
                                        <p>Gain (Av) = -(Rf / R1)</p>
                                    )}
                                    <p className="mt-2 text-muted-foreground italic">Vout = Vin * Gain</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg">Analysis Output</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-center space-y-12">
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Voltage Gain (Av)</div>
                                        <div className="text-5xl font-bold text-red-500 tabular-nums">
                                            {result?.gain || "--"}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Output Voltage (Vout)</div>
                                        <div className="text-4xl font-bold text-primary tabular-nums">
                                            {result?.vout ? `${result.vout} V` : "--"}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg border border-border/50 bg-background/30 text-[11px] text-muted-foreground">
                                        <p>Note: Real-world Op-Amps are limited by their supply voltage (Vcc/Vee). The output will clip if Vout exceeds the supply rails.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </Tabs>
            </div>
            <AIContentIndicator />
        </div>
    )
}
