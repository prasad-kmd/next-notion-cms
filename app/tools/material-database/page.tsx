"use client"

import { useState } from "react"
import {
  Database,
  Search,
  Info,
  ArrowRight,
  Filter,
  Layers,
  Thermometer,
  Zap,
  Weight,
  Expand
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const materials = [
  {
    name: "Aluminium 6061-T6",
    category: "Metals",
    density: 2700,
    elasticModulus: 68.9,
    thermalConductivity: 167,
    meltingPoint: 582,
    yieldStrength: 276,
    description: "Common aerospace aluminium alloy with good strength and weldability."
  },
  {
    name: "Stainless Steel 304",
    category: "Metals",
    density: 8000,
    elasticModulus: 193,
    thermalConductivity: 16.2,
    meltingPoint: 1400,
    yieldStrength: 215,
    description: "Versatile corrosion-resistant steel used in food processing and medical equipment."
  },
  {
    name: "Titanium Ti-6Al-4V",
    category: "Metals",
    density: 4430,
    elasticModulus: 113.8,
    thermalConductivity: 6.7,
    meltingPoint: 1604,
    yieldStrength: 880,
    description: "High strength-to-weight ratio alloy used in aerospace and medical implants."
  },
  {
    name: "Carbon Fiber Reinforced Polymer",
    category: "Composites",
    density: 1600,
    elasticModulus: 150,
    thermalConductivity: 10,
    meltingPoint: 3500, // Sublimation
    yieldStrength: 600,
    description: "High-performance composite material with extreme stiffness and low weight."
  },
  {
    name: "Copper (C101)",
    category: "Metals",
    density: 8960,
    elasticModulus: 117,
    thermalConductivity: 391,
    meltingPoint: 1085,
    yieldStrength: 70,
    description: "Excellent electrical and thermal conductivity material."
  },
  {
    name: "Polycarbonate",
    category: "Polymers",
    density: 1200,
    elasticModulus: 2.3,
    thermalConductivity: 0.2,
    meltingPoint: 225,
    yieldStrength: 62,
    description: "Transparent engineering plastic with high impact resistance."
  },
  {
    name: "Silicon Carbide",
    category: "Ceramics",
    density: 3210,
    elasticModulus: 410,
    thermalConductivity: 120,
    meltingPoint: 2730,
    yieldStrength: 300,
    description: "Extremely hard ceramic with high thermal stability and chemical resistance."
  }
]

export default function MaterialDatabasePage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          m.category.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory ? m.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(materials.map(m => m.category)))

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/tools"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Workspace
          </Link>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                <Database className="h-8 w-8 text-blue-500" />
                Material Property Database
              </h1>
              <p className="mt-2 text-muted-foreground">
                High-fidelity technical specifications for common engineering materials.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search materials or categories..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap"
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((m) => (
            <Card key={m.name} className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50">
              <div className="border-b border-border bg-muted/30 px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">{m.category}</span>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mt-1 text-xl font-bold font-sans">{m.name}</h3>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Weight className="h-3 w-3" /> Density
                    </div>
                    <p className="font-mono text-sm">{m.density} <span className="text-[10px] text-muted-foreground">kg/m³</span></p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Expand className="h-3 w-3" /> Modulus
                    </div>
                    <p className="font-mono text-sm">{m.elasticModulus} <span className="text-[10px] text-muted-foreground">GPa</span></p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Thermometer className="h-3 w-3" /> Cond.
                    </div>
                    <p className="font-mono text-sm">{m.thermalConductivity} <span className="text-[10px] text-muted-foreground">W/m·K</span></p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3" /> Yield
                    </div>
                    <p className="font-mono text-sm">{m.yieldStrength} <span className="text-[10px] text-muted-foreground">MPa</span></p>
                  </div>
                </div>
                <p className="mt-6 text-xs text-muted-foreground italic leading-relaxed">
                  {m.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No materials found matching your criteria.</p>
          </div>
        )}

        <section className="mt-16 rounded-2xl border border-primary/10 bg-primary/5 p-8">
          <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Technical Note
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All property values represent standard room temperature ($20^\circ$C) conditions unless otherwise specified. These values are intended for preliminary engineering design and should be verified with manufacturer-specific data sheets for critical applications.
          </p>
        </section>
      </div>
    </div>
  )
}
