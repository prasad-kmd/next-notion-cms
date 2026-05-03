"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, ChevronLeft, Info, Search, Filter } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { AIContentIndicator } from "@/components/ai-content-indicator"

const TORQUE_DATA = [
    { size: "M3", pitch: 0.5, class88: 1.3, class109: 1.9, class129: 2.2 },
    { size: "M4", pitch: 0.7, class88: 3.0, class109: 4.3, class129: 5.1 },
    { size: "M5", pitch: 0.8, class88: 5.9, class109: 8.4, class129: 10 },
    { size: "M6", pitch: 1.0, class88: 10.1, class109: 14.3, class129: 17.1 },
    { size: "M8", pitch: 1.25, class88: 24.6, class109: 34.6, class129: 41.5 },
    { size: "M10", pitch: 1.5, class88: 48, class109: 68, class129: 82 },
    { size: "M12", pitch: 1.75, class88: 84, class109: 119, class129: 143 },
    { size: "M14", pitch: 2.0, class88: 135, class109: 190, class129: 228 },
    { size: "M16", pitch: 2.0, class88: 206, class109: 290, class129: 348 },
    { size: "M18", pitch: 2.5, class88: 283, class109: 399, class129: 479 },
    { size: "M20", pitch: 2.5, class88: 403, class109: 567, class129: 680 },
]

export default function BoltTorqueChart() {
    const [search, setSearch] = useState("")

    const filtered = TORQUE_DATA.filter(row =>
        row.size.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                            <Wrench className="h-8 w-8 text-zinc-500" />
                            Bolt Torque Reference Chart
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Standard metric torque specifications (Nm) for property classes 8.8, 10.9, and 12.9.
                        </p>
                    </div>
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search size (e.g. M8)..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Bolt Size</th>
                                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Pitch (mm)</th>
                                    <th className="p-4 text-xs font-bold uppercase text-primary">Class 8.8</th>
                                    <th className="p-4 text-xs font-bold uppercase text-orange-500">Class 10.9</th>
                                    <th className="p-4 text-xs font-bold uppercase text-red-500">Class 12.9</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((row, i) => (
                                    <tr key={row.size} className={`border-b border-border/50 transition-colors hover:bg-primary/5 ${i % 2 === 0 ? 'bg-background/20' : ''}`}>
                                        <td className="p-4 font-bold">{row.size}</td>
                                        <td className="p-4 text-muted-foreground font-mono">{row.pitch.toFixed(2)}</td>
                                        <td className="p-4 font-mono font-semibold">{row.class88} Nm</td>
                                        <td className="p-4 font-mono font-semibold text-orange-500/80">{row.class109} Nm</td>
                                        <td className="p-4 font-mono font-semibold text-red-500/80">{row.class129} Nm</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-500/10 border border-zinc-500/20 text-[11px] text-zinc-300">
                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                        <p>
                            Torque values are for metric coarse threads and assume a friction coefficient of µ = 0.14 (dry assembly).
                            Always refer to manufacturer specifications for critical applications.
                        </p>
                    </div>
                    <Card className="bg-primary/5 border-primary/20 p-4 flex items-center gap-4">
                        <Filter className="h-5 w-5 text-primary opacity-50" />
                        <div className="text-[11px]">
                            <p className="font-bold uppercase text-muted-foreground mb-1">Calculation Basis</p>
                            <p className="text-muted-foreground">Values shown represent approximately 90% of the yield strength of the bolt.</p>
                        </div>
                    </Card>
                </div>
            </div>
            <AIContentIndicator />
        </div>
    )
}
