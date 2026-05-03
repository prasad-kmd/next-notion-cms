"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MoveUpRight, ChevronLeft, Disc, Settings } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIContentIndicator } from "@/components/ai-content-indicator"

export default function StepperMotorCalculator() {
    const [driveType, setDriveType] = useState<string>("leadscrew")

    // Motor params
    const [stepAngle, setStepAngle] = useState<string>("1.8")
    const [microstepping, setMicrostepping] = useState<string>("16")

    // Lead screw params
    const [pitch, setPitch] = useState<string>("8.0") // mm/rev

    // Belt params
    const [beltPitch, setBeltPitch] = useState<string>("2.0") // mm
    const [pulleyTeeth, setPulleyTeeth] = useState<string>("20")

    const result = useMemo(() => {
        const angle = parseFloat(stepAngle) || 1.8
        const micro = parseFloat(microstepping) || 1

        if (angle <= 0) return null

        const stepsPerRev = (360 / angle) * micro

        let stepsPerMm = 0
        if (driveType === "leadscrew") {
            const p = parseFloat(pitch) || 1
            if (p <= 0) return null
            stepsPerMm = stepsPerRev / p
        } else {
            const bp = parseFloat(beltPitch) || 1
            const teeth = parseFloat(pulleyTeeth) || 1
            if (bp <= 0 || teeth <= 0) return null
            stepsPerMm = stepsPerRev / (bp * teeth)
        }

        return {
            stepsPerRev: stepsPerRev.toLocaleString(),
            stepsPerMm: stepsPerMm.toFixed(4)
        }
    }, [driveType, stepAngle, microstepping, pitch, beltPitch, pulleyTeeth])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <MoveUpRight className="h-8 w-8 text-rose-500" />
                        Stepper Motor & CNC Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Calculate Steps/mm for 3D printers and CNC machines based on motor and mechanical drive specifications.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Motor Specifications</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="angle">Step Angle (°)</Label>
                                        <select
                                            id="angle"
                                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                                            value={stepAngle}
                                            onChange={(e) => setStepAngle(e.target.value)}
                                        >
                                            <option value="1.8">1.8° (200 steps)</option>
                                            <option value="0.9">0.9° (400 steps)</option>
                                            <option value="7.5">7.5° (48 steps)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="micro">Microstepping</Label>
                                        <select
                                            id="micro"
                                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                                            value={microstepping}
                                            onChange={(e) => setMicrostepping(e.target.value)}
                                        >
                                            <option value="1">1 (Full)</option>
                                            <option value="2">2 (Half)</option>
                                            <option value="4">4</option>
                                            <option value="8">8</option>
                                            <option value="16">16</option>
                                            <option value="32">32</option>
                                            <option value="64">64</option>
                                            <option value="128">128</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Mechanical Drive</CardTitle>
                                    <Tabs value={driveType} onValueChange={setDriveType}>
                                        <TabsList>
                                            <TabsTrigger value="leadscrew">Lead Screw</TabsTrigger>
                                            <TabsTrigger value="belt">Belt & Pulley</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-2">
                                {driveType === "leadscrew" ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="pitch">Screw Lead (mm/rev)</Label>
                                        <Input id="pitch" type="number" value={pitch} onChange={(e) => setPitch(e.target.value)} placeholder="8.0" />
                                        <p className="text-[10px] text-muted-foreground italic">Lead = Pitch × Starts</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bpitch">Belt Pitch (mm)</Label>
                                            <Input id="bpitch" type="number" value={beltPitch} onChange={(e) => setBeltPitch(e.target.value)} placeholder="2.0" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="teeth">Pulley Teeth</Label>
                                            <Input id="teeth" type="number" value={pulleyTeeth} onChange={(e) => setPulleyTeeth(e.target.value)} placeholder="20" />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Configuration Results</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-12">
                                <div className="text-center">
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Firmware Steps/mm</div>
                                    <div className="text-6xl font-bold text-rose-500 tabular-nums">
                                        {result ? result.stepsPerMm : "--"}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Disc className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs font-bold uppercase text-muted-foreground">Steps Per Revolution</span>
                                        </div>
                                        <div className="text-xl font-mono font-bold">{result?.stepsPerRev || "--"}</div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border/50 bg-background/30 text-[11px] text-muted-foreground flex gap-3">
                                    <Settings className="h-4 w-4 shrink-0 mt-0.5 opacity-50" />
                                    <p>
                                        Enter this value into your Marlin (M92), Klipper, or GRBL settings to calibrate the motion axis.
                                        Ensure your microstepping jumpers or software configuration match the selected value.
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
