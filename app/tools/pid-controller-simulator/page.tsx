"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    LineChart as ChartIcon,
    ChevronLeft,
    Sliders,
    Zap
} from "lucide-react"
import Link from "next/link"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

export default function PIDControllerSimulator() {
    const [kp, setKp] = useState<string>("2.0")
    const [ki, setKi] = useState<string>("0.5")
    const [kd, setKd] = useState<string>("0.1")

    const simData = useMemo(() => {
        const p_gain = parseFloat(kp) || 0
        const i_gain = parseFloat(ki) || 0
        const d_gain = parseFloat(kd) || 0

        const setpoint = 1.0
        let position = 0.0
        let velocity = 0.0
        let integral = 0.0
        let prevError = setpoint - position

        const dt = 0.02
        const history = []

        for (let t = 0; t < 500; t++) {
            const error = setpoint - position
            integral += error * dt
            const derivative = (error - prevError) / dt

            const controlSignal = p_gain * error + i_gain * integral + d_gain * derivative

            // Mass-Spring-Dampener System simplified: x'' = F - b*x' - k*x
            const mass = 1.0
            const damping = 0.5
            const spring = 0.5

            const acceleration = (controlSignal - damping * velocity - spring * position) / mass
            velocity += acceleration * dt
            position += velocity * dt

            if (t % 2 === 0) { // Downsample
                history.push({
                    time: Number((t * dt).toFixed(2)),
                    position: Number(position.toFixed(3)),
                    setpoint: setpoint
                })
            }

            prevError = error
        }
        return history
    }, [kp, ki, kd])

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-5xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <ChartIcon className="h-8 w-8 text-violet-500" />
                        PID Controller Simulator
                    </h1>
                    <p className="text-muted-foreground mt-2 font-sans">
                        Interactive step-response simulator for tuning Proportional, Integral, and Derivative gains.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 font-serif">
                                    <Sliders className="h-4 w-4 text-primary" />
                                    Controller Gains
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4 font-sans">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label htmlFor="kp" className="text-xs font-bold uppercase text-muted-foreground">Proportional (Kp)</Label>
                                            <span className="text-xs font-mono text-primary">{kp}</span>
                                        </div>
                                        <input
                                            type="range" id="kp" min="0" max="10" step="0.1"
                                            value={kp} onChange={(e) => setKp(e.target.value)}
                                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label htmlFor="ki" className="text-xs font-bold uppercase text-muted-foreground">Integral (Ki)</Label>
                                            <span className="text-xs font-mono text-primary">{ki}</span>
                                        </div>
                                        <input
                                            type="range" id="ki" min="0" max="5" step="0.1"
                                            value={ki} onChange={(e) => setKi(e.target.value)}
                                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label htmlFor="kd" className="text-xs font-bold uppercase text-muted-foreground">Derivative (Kd)</Label>
                                            <span className="text-xs font-mono text-primary">{kd}</span>
                                        </div>
                                        <input
                                            type="range" id="kd" min="0" max="2" step="0.05"
                                            value={kd} onChange={(e) => setKd(e.target.value)}
                                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/50">
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input type="number" value={kp} onChange={(e) => setKp(e.target.value)} className="h-8 text-xs text-center" />
                                        <Input type="number" value={ki} onChange={(e) => setKi(e.target.value)} className="h-8 text-xs text-center" />
                                        <Input type="number" value={kd} onChange={(e) => setKd(e.target.value)} className="h-8 text-xs text-center" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-200 space-y-2 font-sans">
                            <div className="flex items-center gap-2 font-bold uppercase text-violet-400">
                                <Zap className="h-3 w-3" />
                                Tuning Guide
                            </div>
                            <p><strong>P:</strong> Faster response, but increases overshoot and steady-state error.</p>
                            <p><strong>I:</strong> Eliminates steady-state error, but adds oscillation.</p>
                            <p><strong>D:</strong> Predicts future error to dampen the system and reduce overshoot.</p>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <Card className="border-primary/20 bg-primary/5 flex flex-col h-[500px]">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-serif">Step Response Analysis</CardTitle>
                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider font-sans">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-1 bg-violet-500 rounded-full" />
                                        <span className="text-muted-foreground">PV</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-0.5 border-t border-dashed border-white/50" />
                                        <span className="text-muted-foreground">Setpoint</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 relative pb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={simData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis
                                            dataKey="time"
                                            stroke="rgba(255,255,255,0.3)"
                                            fontSize={10}
                                            tickFormatter={(val) => val.toFixed(1)}
                                        />
                                        <YAxis
                                            domain={[0, 1.5]}
                                            stroke="rgba(255,255,255,0.3)"
                                            fontSize={10}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                            itemStyle={{ fontSize: '10px' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="position"
                                            stroke="#8b5cf6"
                                            strokeWidth={3}
                                            dot={false}
                                            animationDuration={300}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="setpoint"
                                            stroke="rgba(255,255,255,0.3)"
                                            strokeDasharray="5 5"
                                            dot={false}
                                            animationDuration={0}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <AIContentIndicator />
        </div>
    )
}
