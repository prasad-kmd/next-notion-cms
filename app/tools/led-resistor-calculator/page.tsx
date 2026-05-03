"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Lightbulb, ChevronLeft, Info, Zap } from "lucide-react"
import Link from "next/link"
import { AIContentIndicator } from "@/components/ai-content-indicator"

const E24_SERIES = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1]

function getStandardResistor(r: number) {
    const exponent = Math.floor(Math.log10(r))
    const base = r / Math.pow(10, exponent)
    let closest = E24_SERIES[0]

    for (const val of E24_SERIES) {
        if (val >= base) {
            closest = val
            break
        }
    }

    return closest * Math.pow(10, exponent)
}

export default function LEDResistorCalculator() {
    const [sourceVoltage, setSourceVoltage] = useState<string>("5.0")
    const [forwardVoltage, setForwardVoltage] = useState<string>("2.0")
    const [forwardCurrent, setForwardCurrent] = useState<string>("20") // mA
    const [numLeds, setNumLeds] = useState<string>("1")

    const result = useMemo(() => {
        const Vs = parseFloat(sourceVoltage) || 0
        const Vf = parseFloat(forwardVoltage) || 0
        const If = (parseFloat(forwardCurrent) || 0) / 1000
        const N = parseInt(numLeds) || 1

        if (Vs <= 0 || Vf <= 0 || If <= 0) return null
        if (Vs <= (Vf * N)) return { error: "Source voltage must be greater than total forward voltage." }

        const R = (Vs - (Vf * N)) / If
        const P = (Vs - (Vf * N)) * If

        return {
            resistance: R.toFixed(1),
            power: P.toFixed(3),
            standardResistor: getStandardResistor(R).toFixed(1)
        }
    }, [sourceVoltage, forwardVoltage, forwardCurrent, numLeds])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Lightbulb className="h-8 w-8 text-yellow-500" />
                        LED Series Resistor Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Calculate the required resistance and power rating for LEDs connected in series.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Circuit Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="vs">Source Voltage (V)</Label>
                                    <Input id="vs" type="number" value={sourceVoltage} onChange={(e) => setSourceVoltage(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vf">LED Forward Voltage (V)</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input id="vf" type="number" value={forwardVoltage} onChange={(e) => setForwardVoltage(e.target.value)} />
                                        <select
                                            className="bg-background border border-input rounded-md px-3 text-xs"
                                            onChange={(e) => setForwardVoltage(e.target.value)}
                                        >
                                            <option value="">Presets...</option>
                                            <option value="2.0">Red (2.0V)</option>
                                            <option value="2.1">Yellow (2.1V)</option>
                                            <option value="2.2">Green (2.2V)</option>
                                            <option value="3.2">Blue / White (3.2V)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="if">LED Forward Current (mA)</Label>
                                    <Input id="if" type="number" value={forwardCurrent} onChange={(e) => setForwardCurrent(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="n">Number of LEDs in Series</Label>
                                    <Input id="n" type="number" value={numLeds} onChange={(e) => setNumLeds(e.target.value)} min="1" />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[11px] text-yellow-200">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                Formula: R = (Vs - (Vf × N)) / If <br />
                                Make sure the source voltage is high enough to drive the total forward voltage of all LEDs in the series string.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Calculated Values</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-8">
                                {result?.error ? (
                                    <div className="text-center text-destructive p-4 bg-destructive/10 rounded-lg border border-destructive/20 font-medium">
                                        {result.error}
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-center">
                                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Required Resistance</div>
                                            <div className="text-5xl font-bold text-yellow-500 tabular-nums">
                                                {result?.resistance ? `${result.resistance} Ω` : "--"}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                                                <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Standard (E24)</div>
                                                <div className="text-xl font-semibold tabular-nums">{result?.standardResistor ? `${result.standardResistor} Ω` : "--"}</div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                                                <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Resistor Power</div>
                                                <div className="text-xl font-semibold tabular-nums">{result?.power ? `${result.power} W` : "--"}</div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-lg border border-border/50 bg-background/30">
                                            <h4 className="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                                <Zap className="h-3 w-3 text-yellow-500" />
                                                Wattage Recommendation
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground">
                                                Choose a resistor with at least double the calculated power dissipation for long-term reliability.
                                                For {result?.power}W, use at least a {(parseFloat(result?.power || "0") * 2).toFixed(2)}W rated resistor.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <AIContentIndicator />
        </div>
    )
}
