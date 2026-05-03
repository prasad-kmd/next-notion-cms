"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Waypoints, ChevronLeft, Info, Ruler } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { InlineMath, BlockMath } from "react-katex"
import "katex/dist/katex.min.css"

export default function BeamDeflectionCalculator() {
    const [type, setType] = useState<string>("cantilever")
    const [load, setLoad] = useState<string>("1000") // N
    const [length, setLength] = useState<string>("2000") // mm
    const [eModulus, setEModulus] = useState<string>("210000") // MPa (Steel)
    const [inertia, setInertia] = useState<string>("500000") // mm4

    const result = useMemo(() => {
        const P = parseFloat(load) || 0
        const L = parseFloat(length) || 0
        const E = parseFloat(eModulus) || 0
        const I = parseFloat(inertia) || 0

        if (P <= 0 || L <= 0 || E <= 0 || I <= 0) return null

        let maxDeflection = 0

        if (type === "cantilever") {
            // Point load at end: delta = PL^3 / 3EI
            maxDeflection = (P * Math.pow(L, 3)) / (3 * E * I)
        } else {
            // Simply supported, point load at center: delta = PL^3 / 48EI
            maxDeflection = (P * Math.pow(L, 3)) / (48 * E * I)
        }

        return {
            deflection: maxDeflection.toFixed(3)
        }
    }, [type, load, length, eModulus, inertia])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Waypoints className="h-8 w-8 text-indigo-500" />
                        Beam Deflection Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Calculate maximum deflection for standard beam load cases using Euler-Bernoulli beam theory.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Beam Configuration</CardTitle>
                                    <Tabs value={type} onValueChange={setType}>
                                        <TabsList>
                                            <TabsTrigger value="cantilever">Cantilever</TabsTrigger>
                                            <TabsTrigger value="simply-supported">Simple</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="load">Point Load P (N)</Label>
                                    <Input id="load" type="number" value={load} onChange={(e) => setLoad(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="length">Beam Length L (mm)</Label>
                                    <Input id="length" type="number" value={length} onChange={(e) => setLength(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="e">Elastic Modulus E (MPa)</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input id="e" type="number" value={eModulus} onChange={(e) => setEModulus(e.target.value)} />
                                        <select
                                            className="bg-background border border-input rounded-md px-3 text-xs"
                                            onChange={(e) => setEModulus(e.target.value)}
                                        >
                                            <option value="">Material...</option>
                                            <option value="210000">Steel (210 GPa)</option>
                                            <option value="70000">Aluminum (70 GPa)</option>
                                            <option value="200000">Stainless (200 GPa)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="i">Moment of Inertia I (mm⁴)</Label>
                                    <Input id="i" type="number" value={inertia} onChange={(e) => setInertia(e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200 italic">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold mb-2 text-xs">Formula ({type === 'cantilever' ? 'Cantilever' : 'Simply Supported'}):</p>
                                <div className="py-1 text-xl">
                                    <InlineMath math={type === 'cantilever' ? "\\delta_{max} = \\frac{PL^3}{3EI}" : "\\delta_{max} = \\frac{PL^3}{48EI}"} />
                                </div>
                                <p>Assumes small deflections and linear elastic material properties.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Calculated Result</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-8">
                                <div className="text-center">
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Max Deflection (δmax)</div>
                                    <div className="text-6xl font-bold text-indigo-500 tabular-nums">
                                        {result ? `${result.deflection} mm` : "--"}
                                    </div>
                                </div>

                                <div className="p-6 bg-background/40 rounded-xl border border-primary/20 flex flex-col items-center gap-4">
                                    <div className="text-xs font-bold uppercase text-muted-foreground">Deformation Preview</div>
                                    <div className="relative w-full h-24 border-b-2 border-border/50">
                                        {/* Original Beam */}
                                        <div className="absolute top-0 w-full h-px border-t border-dashed border-muted-foreground/30" />
                                        {/* Support */}
                                        {type === "cantilever" ? (
                                            <div className="absolute left-0 top-0 h-4 w-1 bg-muted-foreground" />
                                        ) : (
                                            <>
                                                <div className="absolute left-0 top-0 h-2 w-1 bg-muted-foreground" />
                                                <div className="absolute right-0 top-0 h-2 w-1 bg-muted-foreground" />
                                            </>
                                        )}
                                        {/* Deflected Beam Curve (Simplified) */}
                                        <svg className="absolute top-0 left-0 w-full h-full overflow-visible">
                                            {type === "cantilever" ? (
                                                <path
                                                    d="M 0 0 Q 100 0 200 40"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    className="text-indigo-500/50"
                                                    vectorEffect="non-scaling-stroke"
                                                />
                                            ) : (
                                                <path
                                                    d="M 0 0 Q 100 40 200 0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    className="text-indigo-500/50"
                                                    vectorEffect="non-scaling-stroke"
                                                />
                                            )}
                                        </svg>
                                        {/* Load Arrow */}
                                        <div
                                            className="absolute"
                                            style={{
                                                left: type === 'cantilever' ? '95%' : '50%',
                                                top: '-20px'
                                            }}
                                        >
                                            <div className="flex flex-col items-center text-red-500">
                                                <span className="text-[10px] font-bold">P</span>
                                                <div className="w-0.5 h-4 bg-red-500" />
                                                <div className="w-2 h-2 border-b-2 border-r-2 border-red-500 -rotate-45 -mt-1" />
                                            </div>
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
