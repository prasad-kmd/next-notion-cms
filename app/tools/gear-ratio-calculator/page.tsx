"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Settings2, ChevronLeft, Info, Cog, ArrowRight, Activity } from "lucide-react"
import Link from "next/link"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { InlineMath, BlockMath } from "react-katex"
import "katex/dist/katex.min.css"

export default function GearRatioCalculator() {
    const [driverTeeth, setDriverTeeth] = useState<string>("12")
    const [drivenTeeth, setDrivenTeeth] = useState<string>("36")
    const [inputSpeed, setInputSpeed] = useState<string>("1500") // RPM
    const [inputTorque, setInputTorque] = useState<string>("5.0") // Nm

    const result = useMemo(() => {
        const N1 = parseFloat(driverTeeth) || 0
        const N2 = parseFloat(drivenTeeth) || 0
        const S1 = parseFloat(inputSpeed) || 0
        const T1 = parseFloat(inputTorque) || 0

        if (N1 <= 0 || N2 <= 0) return null

        const ratio = N2 / N1
        const speedOut = S1 / ratio
        const torqueOut = T1 * ratio

        return {
            ratio: ratio.toFixed(3),
            speed: speedOut.toFixed(2),
            torque: torqueOut.toFixed(2)
        }
    }, [driverTeeth, drivenTeeth, inputSpeed, inputTorque])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Settings2 className="h-8 w-8 text-orange-500" />
                        Gear Ratio & Speed Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Analyze output speed and torque for gear trains, belt drives, or chain drives.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Gear Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="driver">Driver Teeth (N1)</Label>
                                        <Input id="driver" type="number" value={driverTeeth} onChange={(e) => setDriverTeeth(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="driven">Driven Teeth (N2)</Label>
                                        <Input id="driven" type="number" value={drivenTeeth} onChange={(e) => setDrivenTeeth(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="speed">Input Speed (RPM)</Label>
                                    <Input id="speed" type="number" value={inputSpeed} onChange={(e) => setInputSpeed(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="torque">Input Torque (Nm)</Label>
                                    <Input id="torque" type="number" value={inputTorque} onChange={(e) => setInputTorque(e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-200">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold mb-1">Fundamental Laws:</p>
                                <p className="text-xl">
                                    <InlineMath math="\begin{array}{rcl}
                                    \text{Ratio} &=& \frac{N_{driven}}{N_{driver}} \\
                                    \omega_{out} &=& \frac{\omega_{in}}{\text{Ratio}} \\
                                    \tau_{out}&=&\frac{\tau_{in}}{\text{Ratio}}
                                    \end{array}"/></p>
                                <p className="text-xs">(assuming 100% efficiency)</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Output Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-10">
                                <div className="text-center">
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Mechanical Advantage (Ratio)</div>
                                    <div className="text-5xl font-bold text-orange-500 tabular-nums">
                                        {result ? result.ratio : "--"}:1
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Output Speed</div>
                                        <div className="text-xl font-semibold tabular-nums">{result ? `${result.speed} RPM` : "--"}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Output Torque</div>
                                        <div className="text-xl font-semibold tabular-nums">{result ? `${result.torque} Nm` : "--"}</div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border/50 bg-background/30">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase mb-4 text-muted-foreground">
                                        <Activity className="h-3.5 w-3.5" />
                                        Drive Train Visual
                                    </div>
                                    <div className="flex items-center justify-around">
                                        <div className="flex flex-col items-center gap-2">
                                            <Cog className="h-10 w-10 text-muted-foreground animate-spin" style={{ animationDuration: '2s' }} />
                                            <span className="text-[9px] uppercase font-bold opacity-50">Driver</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground/30" />
                                        <div className="flex flex-col items-center gap-2">
                                            <Cog
                                                className="text-orange-500 animate-spin"
                                                style={{
                                                    height: result ? `${Math.min(64, Math.max(24, 24 * parseFloat(result.ratio)))}px` : '40px',
                                                    width: result ? `${Math.min(64, Math.max(24, 24 * parseFloat(result.ratio)))}px` : '40px',
                                                    animationDuration: result ? `${2 * parseFloat(result.ratio)}s` : '2s',
                                                    animationDirection: 'reverse'
                                                }}
                                            />
                                            <span className="text-[9px] uppercase font-bold text-orange-500">Driven</span>
                                        </div>
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
