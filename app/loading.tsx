"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[SYS] INITIALIZING_KERNEL..."]);
  const initialResourceCount = useRef(0);
  const processedResources = useRef(new Set<string>());

  useEffect(() => {
    if (typeof window !== "undefined") {
      initialResourceCount.current =
        performance.getEntriesByType("resource").length;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!processedResources.current.has(entry.name)) {
            processedResources.current.add(entry.name);
            const fileName =
              entry.name.split("/").pop()?.split("?")[0] || "unknown_asset";
            const type = (
              entry as PerformanceResourceTiming
            ).initiatorType.toUpperCase();

            setLogs((prev) => [
              ...prev.slice(-4),
              `[LOAD] ${type}::${fileName.substring(0, 20)}... OK`,
            ]);

            // Proportional progress based on discovered resources
            setProgress((prev) => {
              const next = prev + (100 - prev) * 0.15;
              return next > 95 ? 95 : next;
            });
          }
        });
      });

      observer.observe({ entryTypes: ["resource"] });
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background p-6 lg:min-h-screen">
      <div className="w-full max-w-[450px] space-y-6">
        {/* Pulsing Logo Section */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20 blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-2xl overflow-hidden group">
              <Image
                src="/img/favicon/favicon-128.png"
                alt="System Logo"
                width={56}
                height={56}
                className="h-14 w-14 animate-pulse object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Terminal and Progress Section */}
        <div className="overflow-hidden rounded-xl border border-border bg-card/50 shadow-2xl backdrop-blur-sm">
          {/* Mac Terminal Header */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground local-jetbrains-mono">
                System_Monitor.v16
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Terminal Output */}
            <div className="local-jetbrains-mono min-h-[80px] space-y-1 text-[11px] leading-tight text-primary/80">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-muted-foreground opacity-50 select-none">
                    {">"}
                  </span>
                  <span
                    className={cn(i === logs.length - 1 ? "animate-pulse" : "")}
                  >
                    {log}
                  </span>
                </div>
              ))}
              <div className="flex gap-2">
                <span className="text-muted-foreground opacity-50 select-none">
                  {">"}
                </span>
                <span className="w-2 h-4 bg-primary/40 animate-pulse" />
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Deployment_Progress</span>
                <span className="local-jetbrains-mono">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted border border-border/50">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center px-2">
          <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em] local-jetbrains-mono">
            PMEngineerLK // CORE_INIT
          </div>
          <div className="flex gap-4">
            <div className="h-1 w-8 bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary/60 animate-[loading-scan_2s_infinite]" />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading-scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
