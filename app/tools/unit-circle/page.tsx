"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Compass, ChevronLeft, Info } from "lucide-react"
import Link from "next/link"
import { AIContentIndicator } from "@/components/ai-content-indicator"

export default function UnitCircleExplorer() {
    const [angle, setAngle] = useState(45) // degrees

    const rad = (angle * Math.PI) / 180
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    const tan = Math.tan(rad)

    const cx = 150
    const cy = 150
    const r = 100

    const px = cx + r * cos
    const py = cy - r * sin

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Compass className="h-8 w-8 text-cyan-500" />
                        Unit Circle Explorer
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Interactive trigonometric visualization of the unit circle, showing sine, cosine, and tangent relationships.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Trigonometric Visualizer</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <svg width="300" height="300" viewBox="0 0 300 300" className="bg-background/20 rounded-full border border-border/50 shadow-inner">
                                    {/* Axes */}
                                    <line x1="0" y1="150" x2="300" y2="150" stroke="currentColor" strokeOpacity="0.2" />
                                    <line x1="150" y1="0" x2="150" y2="300" stroke="currentColor" strokeOpacity="0.2" />

                                    {/* Circle */}
                                    <circle cx="150" cy="150" r="100" fill="none" stroke="currentColor" strokeWidth="2" />

                                    {/* Cosine (x-projection) */}
                                    <line x1="150" y1="150" x2={px} y2="150" stroke="#ef4444" strokeWidth="3" />
                                    {/* Sine (y-projection) */}
                                    <line x1={px} y1="150" x2={px} y2={py} stroke="#22c55e" strokeWidth="3" />

                                    {/* Hypothenuse */}
                                    <line x1="150" y1="150" x2={px} y2={py} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />

                                    {/* Point */}
                                    <circle cx={px} cy={py} r="5" fill="#3b82f6" />

                                    {/* Labels */}
                                    <text x="255" y="145" fontSize="10" fill="currentColor" opacity="0.5">X (cos)</text>
                                    <text x="155" y="20" fontSize="10" fill="currentColor" opacity="0.5">Y (sin)</text>
                                </svg>

                                <div className="w-full mt-8 space-y-4">
                                    <div className="flex justify-between">
                                        <Label>Angle (θ)</Label>
                                        <span className="font-mono font-bold text-cyan-500">{angle}° / {rad.toFixed(3)} rad</span>
                                    </div>
                                    <Slider
                                        value={[angle]}
                                        onValueChange={(vals) => setAngle(vals[0])}
                                        max={360}
                                        step={1}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                The unit circle is a circle with a radius of 1 centered at the origin (0,0). For any angle θ, the coordinates of the point on the circle are (cos θ, sin θ).
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">Trigonometric Values</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex justify-between items-center">
                                        <span className="text-sm font-bold text-red-500">cos(θ) [x]</span>
                                        <span className="text-2xl font-bold tabular-nums font-mono">{cos.toFixed(4)}</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex justify-between items-center">
                                        <span className="text-sm font-bold text-green-500">sin(θ) [y]</span>
                                        <span className="text-2xl font-bold tabular-nums font-mono">{sin.toFixed(4)}</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex justify-between items-center">
                                        <span className="text-sm font-bold text-cyan-500">tan(θ) [y/x]</span>
                                        <span className="text-2xl font-bold tabular-nums font-mono">
                                            {Math.abs(cos) < 0.0001 ? "∞" : tan.toFixed(4)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-background/30 border border-border/30 text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground mb-1">sec(θ)</div>
                                        <div className="font-mono font-bold">{Math.abs(cos) < 0.0001 ? "N/A" : (1/cos).toFixed(3)}</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/30 border border-border/30 text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground mb-1">csc(θ)</div>
                                        <div className="font-mono font-bold">{Math.abs(sin) < 0.0001 ? "N/A" : (1/sin).toFixed(3)}</div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border/50 bg-background/30 mt-auto">
                                    <h4 className="text-[10px] font-bold uppercase mb-2">Fundamental Identity</h4>
                                    <p className="text-sm font-mono text-muted-foreground text-center">
                                        sin²(θ) + cos²(θ) = 1
                                    </p>
                                    <p className="text-xs text-center mt-1 text-muted-foreground/60">
                                        ({sin.toFixed(3)})² + ({cos.toFixed(3)})² = {(sin*sin + cos*cos).toFixed(1)}
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
