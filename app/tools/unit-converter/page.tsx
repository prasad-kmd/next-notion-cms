"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Scaling,
    ChevronLeft,
    ArrowRightLeft,
    Zap
} from "lucide-react"
import Link from "next/link"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { AIContentIndicator } from "@/components/ai-content-indicator"

type UnitCategory = "length" | "mass" | "temperature" | "area" | "volume" | "pressure" | "energy"

const units: Record<UnitCategory, { label: string, factor: number }[]> = {
    length: [
        { label: "Millimeters (mm)", factor: 0.001 },
        { label: "Centimeters (cm)", factor: 0.01 },
        { label: "Meters (m)", factor: 1 },
        { label: "Kilometers (km)", factor: 1000 },
        { label: "Inches (in)", factor: 0.0254 },
        { label: "Feet (ft)", factor: 0.3048 },
        { label: "Yards (yd)", factor: 0.9144 },
        { label: "Miles (mi)", factor: 1609.344 },
    ],
    mass: [
        { label: "Milligrams (mg)", factor: 0.000001 },
        { label: "Grams (g)", factor: 0.001 },
        { label: "Kilograms (kg)", factor: 1 },
        { label: "Metric Tons (t)", factor: 1000 },
        { label: "Ounces (oz)", factor: 0.0283495 },
        { label: "Pounds (lb)", factor: 0.453592 },
    ],
    temperature: [
        { label: "Celsius (°C)", factor: 1 },
        { label: "Fahrenheit (°F)", factor: 1 },
        { label: "Kelvin (K)", factor: 1 },
    ],
    area: [
        { label: "Sq Millimeters (mm²)", factor: 0.000001 },
        { label: "Sq Meters (m²)", factor: 1 },
        { label: "Sq Kilometers (km²)", factor: 1000000 },
        { label: "Sq Inches (in²)", factor: 0.00064516 },
        { label: "Sq Feet (ft²)", factor: 0.092903 },
        { label: "Acres (ac)", factor: 4046.86 },
        { label: "Hectares (ha)", factor: 10000 },
    ],
    volume: [
        { label: "Milliliters (ml)", factor: 0.001 },
        { label: "Liters (l)", factor: 1 },
        { label: "Cubic Meters (m³)", factor: 1000 },
        { label: "Gallons (US)", factor: 3.78541 },
        { label: "Quarts (US)", factor: 0.946353 },
        { label: "Cubic Inches (in³)", factor: 0.0163871 },
        { label: "Cubic Feet (ft³)", factor: 28.3168 },
    ],
    pressure: [
        { label: "Pascal (Pa)", factor: 1 },
        { label: "Kilopascal (kPa)", factor: 1000 },
        { label: "Bar", factor: 100000 },
        { label: "PSI", factor: 6894.76 },
        { label: "Atmosphere (atm)", factor: 101325 },
    ],
    energy: [
        { label: "Joules (J)", factor: 1 },
        { label: "Kilojoules (kJ)", factor: 1000 },
        { label: "Calories (cal)", factor: 4.184 },
        { label: "Kilocalories (kcal)", factor: 4184 },
        { label: "Watt-hours (Wh)", factor: 3600 },
        { label: "Kilowatt-hours (kWh)", factor: 3600000 },
        { label: "BTU", factor: 1055.06 },
    ]
}

export default function UnitConverter() {
    const [category, setCategory] = useState<UnitCategory>("length")
    const [fromUnit, setFromUnit] = useState<string>("")
    const [toUnit, setToUnit] = useState<string>("")
    const [fromValue, setFromValue] = useState<string>("1")
    const [toValue, setToValue] = useState<string>("")

    const convert = useCallback((val: string, from: string, to: string, cat: UnitCategory) => {
        const num = parseFloat(val)
        if (isNaN(num)) {
            setToValue("")
            return
        }

        if (from === to) {
            setToValue(val)
            return
        }

        if (cat === "temperature") {
            let celsius = 0
            if (from === "Celsius (°C)") celsius = num
            else if (from === "Fahrenheit (°F)") celsius = (num - 32) * 5 / 9
            else if (from === "Kelvin (K)") celsius = num - 273.15

            let result = 0
            if (to === "Celsius (°C)") result = celsius
            else if (to === "Fahrenheit (°F)") result = (celsius * 9 / 5) + 32
            else if (to === "Kelvin (K)") result = celsius + 273.15
            setToValue(parseFloat(result.toFixed(4)).toString())
            return
        }

        const fromFactor = units[cat].find(u => u.label === from)?.factor || 1
        const toFactor = units[cat].find(u => u.label === to)?.factor || 1

        const result = (num * fromFactor) / toFactor
        setToValue(parseFloat(result.toFixed(6)).toString())
    }, [])

    useEffect(() => {
        setFromUnit(units[category][0].label)
        setToUnit(units[category][1].label)
    }, [category])

    useEffect(() => {
        if (fromUnit && toUnit) {
            convert(fromValue, fromUnit, toUnit, category)
        }
    }, [category, fromUnit, toUnit, fromValue, convert])

    const handleSwap = () => {
        const tempUnit = fromUnit
        setFromUnit(toUnit)
        setToUnit(tempUnit)
    }

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background font-sans">
            <div className="mx-auto max-w-4xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 font-sans">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <Scaling className="h-8 w-8 text-cyan-500" />
                        Precision Unit Converter
                    </h1>
                    <p className="text-muted-foreground mt-2 font-sans">
                        Standardized metric and imperial unit conversions for engineering parameters and physical constants.
                    </p>
                </div>

                <div className="grid gap-8">
                    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
                        <div className="bg-primary/5 p-4 border-b border-border/50">

                        </div>

                        {/* Custom Category Selector for better UI */}
                        <div className="p-6 flex flex-wrap gap-2 justify-center border-b border-border/50">
                            {Object.keys(units).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat as UnitCategory)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${category === cat ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <CardContent className="p-8">
                            <div className="grid gap-8 md:grid-cols-[1fr,auto,1fr] items-end">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground font-sans">From</Label>
                                        <Select value={fromUnit} onValueChange={setFromUnit}>
                                            <SelectTrigger className="h-12 bg-background/50 font-sans">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {units[category].map(u => (
                                                    <SelectItem key={u.label} value={u.label}>{u.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            value={fromValue}
                                            onChange={(e) => setFromValue(e.target.value)}
                                            className="h-16 text-2xl font-bold font-mono text-center bg-background"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center pb-2">
                                    <button
                                        onClick={handleSwap}
                                        className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all rotate-90 md:rotate-0"
                                    >
                                        <ArrowRightLeft className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground font-sans">To</Label>
                                        <Select value={toUnit} onValueChange={setToUnit}>
                                            <SelectTrigger className="h-12 bg-background/50 font-sans">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {units[category].map(u => (
                                                    <SelectItem key={u.label} value={u.label}>{u.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-16 flex items-center justify-center text-2xl font-bold font-mono bg-primary/5 border border-primary/20 rounded-md text-primary truncate px-4">
                                            {toValue || "0"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                            <h4 className="font-bold flex items-center gap-2 text-sm font-serif">
                                <Zap className="h-4 w-4 text-primary" />
                                Conversion Logic
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                                All units are converted to a base metric equivalent before being calculated into the target unit.
                                Temperature conversions use specific formulaic mappings for Celsius, Fahrenheit, and Kelvin.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-center items-center text-center">
                            <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1 font-sans">Current Ratio</div>
                            <div className="text-sm font-mono text-foreground italic">
                                1 {fromUnit} ≈ {(parseFloat(toValue) / (parseFloat(fromValue) || 1)).toFixed(6)} {toUnit}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AIContentIndicator />
        </div>
    )
}
