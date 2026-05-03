"use client"

import React, { useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Waypoints, ChevronLeft, Info, Settings, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { usePersistentState } from "@/hooks/use-persistent-state"
import { toast } from "sonner"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function MomentOfInertiaCalculator() {
    const resultsRef = useRef<HTMLDivElement>(null)
    const [isExporting, setIsExporting] = useState(false)
    const [shape, setShape] = usePersistentState<string>("moi-shape", "rectangle")

    // Rectangle params
    const [width, setWidth] = usePersistentState<string>("moi-w", "100")
    const [height, setHeight] = usePersistentState<string>("moi-h", "200")

    // Circle params
    const [diameter, setDiameter] = usePersistentState<string>("moi-d", "100")

    // I-Beam params
    const [bf, setBf] = usePersistentState<string>("moi-bf", "150") // flange width
    const [tf, setTf] = usePersistentState<string>("moi-tf", "10")  // flange thickness
    const [hw, setHw] = usePersistentState<string>("moi-hw", "300") // web height
    const [tw, setTw] = usePersistentState<string>("moi-tw", "8")   // web thickness

    const results = useMemo(() => {
        let ixx = 0
        let iyy = 0
        let area = 0

        if (shape === "rectangle") {
            const b = parseFloat(width) || 0
            const h = parseFloat(height) || 0
            ixx = (b * Math.pow(h, 3)) / 12
            iyy = (h * Math.pow(b, 3)) / 12
            area = b * h
        } else if (shape === "circle") {
            const d = parseFloat(diameter) || 0
            ixx = (Math.PI * Math.pow(d, 4)) / 64
            iyy = ixx
            area = (Math.PI * Math.pow(d, 2)) / 4
        } else if (shape === "ibeam") {
            const B = parseFloat(bf) || 0
            const Tf = parseFloat(tf) || 0
            const Hw = parseFloat(hw) || 0
            const Tw = parseFloat(tw) || 0
            const H = Hw + 2 * Tf

            // Ixx = (B*H^3 / 12) - ((B-Tw)*Hw^3 / 12)
            ixx = (B * Math.pow(H, 3) / 12) - ((B - Tw) * Math.pow(Hw, 3) / 12)

            // Iyy = 2*(Tf*B^3 / 12) + (Hw*Tw^3 / 12)
            iyy = 2 * (Tf * Math.pow(B, 3) / 12) + (Hw * Math.pow(Tw, 3) / 12)

            area = (2 * B * Tf) + (Hw * Tw)
        }

        return {
            ixx: ixx.toExponential(4),
            iyy: iyy.toExponential(4),
            area: area.toFixed(2)
        }
    }, [shape, width, height, diameter, bf, tf, hw, tw])

    const handleExport = async () => {
        if (!resultsRef.current) return
        setIsExporting(true)
        const toastId = toast.loading("Generating PDF...")

        try {
            const canvas = await html2canvas(resultsRef.current, {
                scale: 2,
                backgroundColor: "#020617",
            })
            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [canvas.width / 2, canvas.height / 2]
            })
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2)
            pdf.save("moment_of_inertia_results.pdf")
            toast.success("Exported successfully", { id: toastId })
        } catch (e) {
            toast.error("Export failed", { id: toastId })
        } finally {
            setIsExporting(false)
        }
    }

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
                        Moment of Inertia Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Compute Area Moment of Inertia (Ixx, Iyy) for standard cross-sections. Essential for structural analysis and beam deflection.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Section Selection</CardTitle>
                                <Tabs value={shape} onValueChange={setShape} className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="rectangle">Rectangle</TabsTrigger>
                                        <TabsTrigger value="circle">Circle</TabsTrigger>
                                        <TabsTrigger value="ibeam">I-Beam</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {shape === "rectangle" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="width">Width (b) [mm]</Label>
                                            <Input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="height">Height (h) [mm]</Label>
                                            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                                        </div>
                                    </>
                                )}
                                {shape === "circle" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="diameter">Diameter (d) [mm]</Label>
                                        <Input id="diameter" type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)} />
                                    </div>
                                )}
                                {shape === "ibeam" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bf">Flange Width (B)</Label>
                                            <Input id="bf" type="number" value={bf} onChange={(e) => setBf(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tf">Flange Thickness (Tf)</Label>
                                            <Input id="tf" type="number" value={tf} onChange={(e) => setTf(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hw">Web Height (Hw)</Label>
                                            <Input id="hw" type="number" value={hw} onChange={(e) => setHw(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tw">Web Thickness (Tw)</Label>
                                            <Input id="tw" type="number" value={tw} onChange={(e) => setTw(e.target.value)} />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                The Area Moment of Inertia represents a shape's resistance to bending. Ixx is for bending about the horizontal axis, and Iyy is for bending about the vertical axis.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card ref={resultsRef} className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Structural Properties</CardTitle>
                                <Button variant="ghost" size="icon" onClick={handleExport} disabled={isExporting}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-6">
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Ixx (mm⁴)</div>
                                        <div className="text-2xl font-bold text-indigo-500 tabular-nums">{results.ixx}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Iyy (mm⁴)</div>
                                        <div className="text-2xl font-bold text-indigo-500 tabular-nums">{results.iyy}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Total Area (mm²)</div>
                                        <div className="text-2xl font-bold text-muted-foreground tabular-nums">{results.area}</div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border/50 bg-background/30 mt-auto">
                                    <h4 className="text-[10px] font-bold uppercase mb-2 flex items-center gap-2">
                                        <Settings className="h-3 w-3" />
                                        Application
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground">
                                        Use these values in the <strong>Beam Deflection Calculator</strong> to analyze structural performance under load.
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
