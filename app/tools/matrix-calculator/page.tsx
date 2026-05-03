"use client"

import React, { useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Sigma, ChevronLeft, Info, Grid3X3, Download, Settings2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AIContentIndicator } from "@/components/ai-content-indicator"
import { usePersistentState } from "@/hooks/use-persistent-state"
import { toast } from "sonner"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { cn } from "@/lib/utils"

const title = "Matrix Calculator"
const description = "Calculate determinant, inverse, and trace for matrices with real-time validation."

export default function MatrixCalculator() {
    const resultsRef = useRef<HTMLDivElement>(null)
    const [isExporting, setIsExporting] = useState(false)
    const [size, setSize] = usePersistentState<number>("matrix-size", 3)
    const [matrix, setMatrix] = usePersistentState<number[][]>("matrix-data", [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1]
    ])
    const [vectorB, setVectorB] = usePersistentState<number[]>("matrix-vector-b-data", [1, 0, 0, 0, 0])

    const currentMatrix = useMemo(() => {
        return matrix.slice(0, size).map(row => row.slice(0, size))
    }, [matrix, size])

    const currentVectorB = useMemo(() => {
        return vectorB.slice(0, size)
    }, [vectorB, size])

    const updateCell = (r: number, c: number, val: string) => {
        const newMatrix = matrix.map(row => [...row])
        newMatrix[r][c] = parseFloat(val) || 0
        setMatrix(newMatrix)
    }

    const updateVector = (i: number, val: string) => {
        const newVector = [...vectorB]
        newVector[i] = parseFloat(val) || 0
        setVectorB(newVector)
    }

    const matrixMath = useMemo(() => {
        const n = size
        const A = currentMatrix
        const B = currentVectorB

        // Determinant using recursion (fine for up to 5x5)
        const getDet = (m: number[][]): number => {
            const len = m.length
            if (len === 1) return m[0][0]
            if (len === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0]
            let det = 0
            for (let i = 0; i < len; i++) {
                const subMatrix = m.slice(1).map(row => row.filter((_, j) => j !== i))
                det += Math.pow(-1, i) * m[0][i] * getDet(subMatrix)
            }
            return det
        }

        // Inverse using Gaussian elimination
        const getInverse = (m: number[][]): number[][] | null => {
            const len = m.length
            const identity = Array.from({ length: len }, (_, i) =>
                Array.from({ length: len }, (_, j) => (i === j ? 1 : 0))
            )
            const augmented = m.map((row, i) => [...row, ...identity[i]])

            for (let i = 0; i < len; i++) {
                let maxRow = i
                for (let k = i + 1; k < len; k++) {
                    if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) maxRow = k
                }
                [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]

                const pivot = augmented[i][i]
                if (Math.abs(pivot) < 1e-10) return null

                for (let j = i; j < 2 * len; j++) augmented[i][j] /= pivot

                for (let k = 0; k < len; k++) {
                    if (k !== i) {
                        const factor = augmented[k][i]
                        for (let j = i; j < 2 * len; j++) augmented[k][j] -= factor * augmented[i][j]
                    }
                }
            }
            return augmented.map(row => row.slice(len))
        }

        // Solve Ax = B
        const solve = (m: number[][], v: number[]): number[] | null => {
            const inv = getInverse(m)
            if (!inv) return null
            const res = new Array(n).fill(0)
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    res[i] += inv[i][j] * v[j]
                }
            }
            return res
        }

        const det = getDet(A)
        const inverse = getInverse(A)
        const solution = solve(A, B)
        const trace = A.reduce((acc, row, i) => acc + row[i], 0)

        return { det, inverse, solution, trace }
    }, [currentMatrix, currentVectorB, size])

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
            pdf.save(`matrix_${size}x${size}_results.pdf`)
            toast.success("Exported successfully", { id: toastId })
        } catch (e) {
            toast.error("Export failed", { id: toastId })
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
            <div className="mx-auto max-w-5xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                            <Grid3X3 className="h-8 w-8 text-purple-500" />
                            {size}x{size} Matrix & Linear System
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Calculate properties of a {size}x{size} matrix and solve linear systems of the form Ax = B.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-2 rounded-xl border border-primary/10">
                        <Settings2 className="h-4 w-4 text-muted-foreground ml-2" />
                        <div className="flex gap-1">
                            {[2, 3, 4, 5].map((n) => (
                                <Button
                                    key={n}
                                    variant={size === n ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSize(n)}
                                    className="h-8 w-8 p-0"
                                >
                                    {n}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-lg">Matrix A ({size}x{size})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="grid gap-2"
                                    style={{
                                        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
                                    }}
                                >
                                    {currentMatrix.map((row, r) =>
                                        row.map((val, c) => (
                                            <Input
                                                key={`${r}-${c}`}
                                                type="number"
                                                value={val}
                                                onChange={(e) => updateCell(r, c, e.target.value)}
                                                className="text-center font-mono text-sm px-1 h-9"
                                            />
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Vector B (for Ax = B)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="grid gap-2"
                                    style={{
                                        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
                                    }}
                                >
                                    {currentVectorB.map((val, i) => (
                                        <Input
                                            key={`b-${i}`}
                                            type="number"
                                            value={val}
                                            onChange={(e) => updateVector(i, e.target.value)}
                                            className="text-center font-mono text-sm h-9"
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                Matrix operations are fundamental in engineering. For systems larger than 5x5, iterative methods or numerical software like MATLAB/Python are typically preferred.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card ref={resultsRef} className="border-primary/20 bg-primary/5 h-full flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-bold">Analysis & Solution</CardTitle>
                                <Button variant="ghost" size="icon" onClick={handleExport} disabled={isExporting}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Determinant</div>
                                        <div className="text-2xl font-bold text-purple-500 tabular-nums truncate px-1">
                                            {matrixMath.det.toFixed(4).replace(/\.?0+$/, '')}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                                        <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Trace</div>
                                        <div className="text-2xl font-bold text-muted-foreground tabular-nums">
                                            {matrixMath.trace.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground font-bold">Solution Vector (x)</Label>
                                    {matrixMath.solution ? (
                                        <div
                                            className="grid gap-2"
                                            style={{
                                                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
                                            }}
                                        >
                                            {matrixMath.solution.map((val, i) => (
                                                <div key={`sol-${i}`} className="p-2 bg-purple-500/10 border border-purple-500/30 rounded text-center font-mono font-bold text-purple-300 text-xs truncate">
                                                    {val.toFixed(4).replace(/\.?0+$/, '')}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-center text-red-200 text-sm font-medium">
                                            No unique solution exists
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground font-bold">Inverse Matrix (A⁻¹)</Label>
                                    {matrixMath.inverse ? (
                                        <div
                                            className="grid gap-1.5"
                                            style={{
                                                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
                                            }}
                                        >
                                            {matrixMath.inverse.map((row, r) =>
                                                row.map((val, c) => (
                                                    <div key={`inv-${r}-${c}`} className="p-1.5 bg-background/50 border border-border/50 rounded text-center font-mono text-[10px] truncate">
                                                        {val.toFixed(3).replace(/\.?0+$/, '')}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-center text-red-200 text-sm font-medium">
                                            Singular Matrix (Rank &lt; {size})
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 rounded-lg border border-border/50 bg-background/30 mt-auto">
                                    <h4 className="text-[10px] font-bold uppercase mb-2 flex items-center gap-2">
                                        <Sigma className="h-3 w-3" />
                                        Advanced Properties
                                    </h4>
                                    <div className="text-[11px] text-muted-foreground space-y-1">
                                        <p>• Condition: {Math.abs(matrixMath.det) < 1e-10 ? "Singular" : "Non-singular"}</p>
                                        <p>• Square: Yes ({size}x{size})</p>
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
