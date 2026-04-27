"use client";

import { useEffect } from "react";
import {
  RefreshCcw,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  HardDrive,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    console.error("KERNEL_PANIC:", error);
  }, [error]);

  const handleRefresh = () => {
    window.location.assign(window.location.href);
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground local-jetbrains-mono selection:bg-primary/30">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
          {/* Background Technical Grid */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,var(--destructive)_0%,transparent_100%)] opacity-[0.03]" />

          <div className="w-full max-w-xl space-y-8 rounded-2xl border border-destructive/20 bg-card/50 p-8 shadow-2xl backdrop-blur-xl">
            {/* Header Section */}
            <div className="flex items-start justify-between border-b border-border pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">
                    System_Critical_Failure
                  </span>
                </div>
                <h1 className="text-2xl font-black mozilla-headline tracking-tight uppercase">
                  Kernel Panic
                </h1>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-xl border-border bg-background/50"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Diagnostic Data */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted/30 p-4 text-center">
                <Cpu className="mb-2 h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                  Process
                </span>
                <span className="text-[10px] font-black text-foreground">
                  HALTED
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted/30 p-4 text-center">
                <HardDrive className="mb-2 h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                  Memory
                </span>
                <span className="text-[10px] font-black text-foreground">
                  DUMPED
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted/30 p-4 text-center">
                <Monitor className="mb-2 h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                  Display
                </span>
                <span className="text-[10px] font-black text-foreground">
                  SAFE_MODE
                </span>
              </div>
            </div>

            {/* Error Log */}
            <div className="space-y-4">
              <div className="relative rounded-xl border border-border bg-black/90 p-5 font-mono text-[11px] leading-relaxed text-red-500/90 shadow-inner">
                <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-white/40 uppercase tracking-widest">
                    Diagnostic_Log
                  </span>
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <p className="mb-1 text-white/60">
                  [{new Date().toISOString()}] FATAL_EXCEPTION_OCCURRED
                </p>
                <p className="break-all">
                  MESSAGE:{" "}
                  {error.message || "An unexpected core failure occurred."}
                </p>
                {error.digest && (
                  <p className="mt-2 text-white/40">DIGEST: {error.digest}</p>
                )}
                <div className="mt-4 flex gap-2 overflow-hidden whitespace-nowrap opacity-20 select-none">
                  {[...Array(20)].map((_, i) => {
                    const hex = (((i + 7) * 0x314159) % 0xffffff)
                      .toString(16)
                      .toUpperCase()
                      .padStart(6, "0");
                    return <span key={i}>0x{hex}</span>;
                  })}
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The application encountered a catastrophic failure that could
                  not be recovered automatically. Manual intervention is
                  required to reinitialize the session.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                  <Button
                    onClick={handleRefresh}
                    size="lg"
                    className="w-full sm:w-auto rounded-full px-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all active:scale-95 shadow-lg shadow-destructive/20"
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Force System Reboot
                  </Button>
                  <Button
                    onClick={() => reset()}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto rounded-full px-8 border-border hover:bg-muted transition-all active:scale-95"
                  >
                    Attempt Recovery
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em]">
                PMEngineerLK // Emergency_Protocol
              </span>
              <div className="flex gap-1.5">
                <div className="h-1 w-1 rounded-full bg-red-500/50" />
                <div className="h-1 w-1 rounded-full bg-red-500/30" />
                <div className="h-1 w-1 rounded-full bg-red-500/10" />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
