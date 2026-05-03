"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Activity, ChevronLeft, Info, Zap } from "lucide-react"
import Link from "next/link"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { usePersistentState } from "@/hooks/use-persistent-state"

export default function PWMVoltageConverter() {
    const [peakVoltage, setPeakVoltage] = usePersistentState<string>("pwm-vpeak", "5")
    const [dutyCycle, setDutyCycle] = usePersistentState<number>("pwm-duty", 50)
    const [targetVoltage, setTargetVoltage] = usePersistentState<string>("pwm-vtarget", "2.5")

    const results = useMemo(() => {
        const vp = parseFloat(peakVoltage) || 0
        const vavg = (vp * dutyCycle) / 100

        const vt = parseFloat(targetVoltage) || 0
        const requiredDuty = vp > 0 ? (vt / vp) * 100 : 0

        return {
            vavg: vavg.toFixed(3),
            requiredDuty: requiredDuty.toFixed(2)
        }
    }, [peakVoltage, dutyCycle, targetVoltage])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Activity className="h-8 w-8 text-rose-500" />
                        PWM to Voltage Converter
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Convert PWM duty cycle to average DC voltage and vice-versa. Ideal for microcontroller signal processing.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">PWM Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="peak-v">Peak Voltage (Vₚₖ) [V]</Label>
                                    <Input id="peak-v" type="number" value={peakVoltage} onChange={(e) => setPeakVoltage(e.target.value)} />
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between">
                                        <Label>Duty Cycle (%)</Label>
                                        <span className="font-mono font-bold text-rose-500">{dutyCycle}%</span>
                                    </div>
                                    <Slider
                                        value={[dutyCycle]}
                                        onValueChange={(vals) => setDutyCycle(vals[0])}
                                        max={100}
                                        step={0.1}
                                    />
                                </div>

                                <div className="pt-4 border-t border-border/50">
                                    <div className="space-y-2">
                                        <Label htmlFor="target-v">Find Duty Cycle for Target Voltage (V)</Label>
                                        <Input id="target-v" type="number" value={targetVoltage} onChange={(e) => setTargetVoltage(e.target.value)} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                Pulse Width Modulation (PWM) creates an average DC voltage by rapidly switching a signal between 0V and peak voltage. The average voltage is directly proportional to the duty cycle.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Conversion Results</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-8">
                                <div className="text-center">
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Average Voltage (Vₐᵥ)</div>
                                    <div className="text-6xl font-bold text-rose-500 tabular-nums">
                                        {results.vavg} <span className="text-2xl text-muted-foreground font-normal">V</span>
                                    </div>
                                </div>

                                <div className="p-6 rounded-xl bg-background/50 border border-border/50 text-center">
                                    <div className="text-xs uppercase text-muted-foreground font-bold mb-2">Required Duty for {targetVoltage}V</div>
                                    <div className="text-3xl font-bold text-muted-foreground tabular-nums">
                                        {parseFloat(results.requiredDuty) > 100 ? "Impossible (>100%)" : results.requiredDuty + "%"}
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border/50 bg-background/30 mt-auto">
                                    <h4 className="text-[10px] font-bold uppercase mb-2 flex items-center gap-2">
                                        <Zap className="h-3 w-3" />
                                        Microcontroller Tip
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground">
                                        If your MCU has an 8-bit PWM, multiply the percentage by 2.55 to get the register value (0-255). For 10-bit, multiply by 10.23 (0-1023).
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
