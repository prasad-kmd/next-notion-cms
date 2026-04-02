"use client";

import React, { useState } from "react";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/fade-in";
import { Wrench, FileJson, Hash, Copy, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ToolsPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setJsonOutput("Invalid JSON input");
    }
  };

  const encodeBase64 = () => {
    try {
      setBase64Output(btoa(base64Input));
    } catch (e) {
      setBase64Output("Error encoding to Base64");
    }
  };

  const decodeBase64 = () => {
    try {
      setBase64Output(atob(base64Input));
    } catch (e) {
      setBase64Output("Error decoding from Base64");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="py-20">
      <Container>
        <FadeIn direction="down" className="flex flex-col space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest">
            <Wrench size={14} /> Utility Tools
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            Engineering Tools
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            A collection of interactive utility tools for common engineering tasks.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* JSON Formatter */}
          <FadeIn delay={0.1} direction="none">
            <div className="rounded-3xl border border-border/40 bg-card/40 p-8 glass-card space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <FileJson size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">JSON Formatter</h2>
                </div>
                <button
                  onClick={() => {setJsonInput(""); setJsonOutput("");}}
                  className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
                  title="Reset"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste your JSON here..."
                  className="w-full h-40 rounded-xl bg-background/50 border border-border/40 p-4 font-mono text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all resize-none text-foreground"
                />
                <button
                  onClick={formatJson}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Format JSON
                </button>
                {jsonOutput && (
                  <div className="relative group">
                    <pre className="w-full h-60 rounded-xl bg-secondary/30 border border-border/40 p-4 font-mono text-xs overflow-auto text-foreground">
                      {jsonOutput}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(jsonOutput, "json")}
                      className="absolute top-2 right-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/40 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      {copied === "json" ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Base64 Converter */}
          <FadeIn delay={0.2} direction="none">
            <div className="rounded-3xl border border-border/40 bg-card/40 p-8 glass-card space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Hash size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Base64 Converter</h2>
                </div>
                <button
                  onClick={() => {setBase64Input(""); setBase64Output("");}}
                  className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
                  title="Reset"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <textarea
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  placeholder="Enter text or base64 string..."
                  className="w-full h-40 rounded-xl bg-background/50 border border-border/40 p-4 font-mono text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all resize-none text-foreground"
                />
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={encodeBase64}
                    className="h-12 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Encode
                  </button>
                  <button
                    onClick={decodeBase64}
                    className="h-12 rounded-xl bg-secondary text-secondary-foreground border border-border/40 font-semibold hover:bg-secondary/80 transition-all"
                  >
                    Decode
                  </button>
                </div>
                {base64Output && (
                  <div className="relative group">
                    <div className="w-full h-60 rounded-xl bg-secondary/30 border border-border/40 p-4 font-mono text-sm overflow-auto break-all text-foreground">
                      {base64Output}
                    </div>
                    <button
                      onClick={() => copyToClipboard(base64Output, "base64")}
                      className="absolute top-2 right-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/40 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      {copied === "base64" ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
