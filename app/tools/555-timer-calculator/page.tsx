"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Timer, ChevronLeft, Info, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIContentIndicator } from "@/components/ai-content-indicator";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function Timer555Calculator() {
  const [mode, setMode] = useState<string>("astable");

  // Astable inputs
  const [r1, setR1] = useState<string>("10"); // kOhm
  const [r2, setR2] = useState<string>("100"); // kOhm
  const [c1, setC1] = useState<string>("10"); // uF

  // Monostable inputs
  const [rm, setRm] = useState<string>("10"); // kOhm
  const [cm, setCm] = useState<string>("10"); // uF

  const results = useMemo(() => {
    if (mode === "astable") {
      const R1 = parseFloat(r1) * 1000 || 0;
      const R2 = parseFloat(r2) * 1000 || 0;
      const C = parseFloat(c1) * 1e-6 || 0;

      if (R1 <= 0 || R2 <= 0 || C <= 0) return null;

      const frequency = 1.44 / ((R1 + 2 * R2) * C);
      const period = 1 / frequency;
      const th = 0.693 * (R1 + R2) * C;
      const tl = 0.693 * R2 * C;
      const dutyCycle = (th / period) * 100;

      return {
        frequency:
          frequency >= 1000
            ? (frequency / 1000).toFixed(2) + " kHz"
            : frequency.toFixed(2) + " Hz",
        period:
          period >= 1
            ? period.toFixed(2) + " s"
            : (period * 1000).toFixed(2) + " ms",
        th: th >= 1 ? th.toFixed(2) + " s" : (th * 1000).toFixed(2) + " ms",
        tl: tl >= 1 ? tl.toFixed(2) + " s" : (tl * 1000).toFixed(2) + " ms",
        dutyCycle: dutyCycle.toFixed(1) + "%",
      };
    } else {
      const R = parseFloat(rm) * 1000 || 0;
      const C = parseFloat(cm) * 1e-6 || 0;

      if (R <= 0 || C <= 0) return null;

      const pulseWidth = 1.1 * R * C;

      return {
        pulseWidth:
          pulseWidth >= 1
            ? pulseWidth.toFixed(2) + " s"
            : (pulseWidth * 1000).toFixed(2) + " ms",
      };
    }
  }, [mode, r1, r2, c1, rm, cm]);

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Workspace
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
            <Timer className="h-8 w-8 text-blue-500" />
            555 Timer Calculator
          </h1>
          <p className="text-muted-foreground mt-2">
            Calculate component values for Astable and Monostable 555 timer
            circuits.
          </p>
        </div>

        <Tabs value={mode} onValueChange={setMode} className="w-full space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="astable">Astable Mode</TabsTrigger>
            <TabsTrigger value="monostable">Monostable Mode</TabsTrigger>
          </TabsList>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Circuit Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mode === "astable" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="r1">Resistor R1 (kΩ)</Label>
                        <Input
                          id="r1"
                          type="number"
                          value={r1}
                          onChange={(e) => setR1(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="r2">Resistor R2 (kΩ)</Label>
                        <Input
                          id="r2"
                          type="number"
                          value={r2}
                          onChange={(e) => setR2(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="c1">Capacitor C (µF)</Label>
                        <Input
                          id="c1"
                          type="number"
                          value={c1}
                          onChange={(e) => setC1(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="rm">Resistor R (kΩ)</Label>
                        <Input
                          id="rm"
                          type="number"
                          value={rm}
                          onChange={(e) => setRm(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cm">Capacitor C (µF)</Label>
                        <Input
                          id="cm"
                          type="number"
                          value={cm}
                          onChange={(e) => setCm(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-200">
                <Info className="h-4 w-4 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold mb-2 text-xs">
                    Theoretical Formulas:
                  </p>
                  {mode === "astable" ? (
                    <div className="space-y-2 text-sm">
                      <div>
                        <InlineMath math="f = \frac{1.44}{(R_1 + 2R_2) \cdot C}" />
                      </div>
                      <div>
                        <InlineMath math="\text{Duty Cycle} = \frac{R_1 + R_2}{R_1 + 2R_2} \times 100\%" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <InlineMath math="T = 1.1 \cdot R \cdot C" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">Timing Analysis</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center gap-6">
                  {mode === "astable" ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Frequency
                        </div>
                        <div className="text-4xl font-bold text-blue-500 tabular-nums">
                          {results?.frequency || "--"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                          <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">
                            Duty Cycle
                          </div>
                          <div className="text-lg font-semibold tabular-nums">
                            {results?.dutyCycle || "--"}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                          <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">
                            Period
                          </div>
                          <div className="text-lg font-semibold tabular-nums">
                            {results?.period || "--"}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                          <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">
                            Time High (tH)
                          </div>
                          <div className="text-lg font-semibold tabular-nums">
                            {results?.th || "--"}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                          <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">
                            Time Low (tL)
                          </div>
                          <div className="text-lg font-semibold tabular-nums">
                            {results?.tl || "--"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Pulse Width (T)
                      </div>
                      <div className="text-5xl font-bold text-blue-500 tabular-nums">
                        {results?.pulseWidth || "--"}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-4 rounded-lg bg-background/40 border border-border/50">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase mb-3 text-muted-foreground">
                      <Activity className="h-3.3 w-3.3" />
                      Waveform Visualization
                    </div>
                    <div className="h-16 w-full flex items-end gap-[1px]">
                      {mode === "astable" ? (
                        Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-full w-2",
                              i % 4 < 2
                                ? "bg-blue-500/40 border-t-2 border-blue-500"
                                : "bg-transparent border-b-2 border-blue-500",
                            )}
                          />
                        ))
                      ) : (
                        <div className="flex items-end w-full">
                          <div className="h-[2px] w-[20%] bg-blue-500" />
                          <div className="h-full w-[1px] bg-blue-500" />
                          <div className="h-full w-[50%] bg-blue-500/40 border-t-2 border-blue-500" />
                          <div className="h-full w-[1px] bg-blue-500" />
                          <div className="h-[2px] w-[30%] bg-blue-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
      <AIContentIndicator />
    </div>
  );
}
