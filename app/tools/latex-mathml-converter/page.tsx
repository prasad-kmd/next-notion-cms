"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Replace,
  ChevronLeft,
  Copy,
  Check,
  Trash2,
  FileCode,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import temml from "temml";
import { AIContentIndicator } from "@/components/ai-content-indicator";

export default function LatexMathMLConverter() {
  const [latex, setLatex] = useState<string>("x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}");
  const [mathml, setMathML] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const convertLatexToMathML = useCallback((input: string) => {
    try {
      if (!input.trim()) {
        setMathML("");
        return;
      }
      const converted = temml.renderToString(input, { MathML: true });
      setMathML(converted);
    } catch (err) {
      setMathML(`Error: ${err instanceof Error ? err.message : "Invalid LaTeX syntax"}`);
    }
  }, []);

  useEffect(() => {
    // We use a small delay or just ensure it only runs once per change
    const timeout = setTimeout(() => {
        convertLatexToMathML(latex);
    }, 0);
    return () => clearTimeout(timeout);
  }, [latex, convertLatexToMathML]);

  const handleCopy = () => {
    navigator.clipboard.writeText(mathml);
    setCopied(true);
    toast.success("MathML copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setLatex("");
    setMathML("");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background font-sans">
      <div className="mx-auto max-w-5xl">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 font-sans">
          <ChevronLeft className="h-4 w-4" />
          Back to Workspace
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
            <Replace className="h-8 w-8 text-purple-500" />
            MathML Integration Engine
          </h1>
          <p className="text-muted-foreground mt-2 font-sans">
            Transform LaTeX syntax into standards-compliant MathML for accessible and high-fidelity web rendering.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-serif">LaTeX Input</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleClear} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={latex}
                  onChange={(e) => setLatex(e.target.value)}
                  placeholder="Enter LaTeX here (e.g., E = mc^2)..."
                  className="min-h-[300px] font-mono text-sm leading-relaxed bg-background/50"
                />
              </CardContent>
            </Card>

            <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-sm font-serif text-purple-400">
                    <ArrowRight className="h-4 w-4" />
                    Integration Tip
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    MathML is the web standard for mathematical notation. Use the generated output within <code>&lt;math&gt;</code> tags for native browser rendering without external libraries.
                </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-serif">MathML Output</CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2 font-sans"
                    disabled={!mathml || mathml.startsWith("Error")}
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy MathML"}
                </Button>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="relative h-full">
                    <pre className="p-4 rounded-xl bg-background/50 border border-border/50 text-[10px] font-mono overflow-auto max-h-[500px] whitespace-pre-wrap break-all h-full">
                        {mathml || "Result will appear here..."}
                    </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-primary/10 bg-card/30 p-8">
            <h2 className="text-lg font-bold mb-4 font-serif flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" />
                Live Preview
            </h2>
            <div className="p-8 rounded-xl bg-background border border-border/50 flex items-center justify-center min-h-[100px] overflow-x-auto">
                {mathml && !mathml.startsWith("Error") ? (
                    <div dangerouslySetInnerHTML={{ __html: mathml }} className="text-2xl" />
                ) : (
                    <span className="text-muted-foreground italic text-sm font-sans">Preview not available</span>
                )}
            </div>
        </section>
      </div>
      <AIContentIndicator />
    </div>
  );
}
