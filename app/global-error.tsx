"use client";

import { useEffect } from "react";
import { RefreshCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center sm:py-32 lg:px-8 bg-background text-foreground">
          {/* Background Decor */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--destructive)_0%,transparent_100%)] opacity-[0.05]" />
          <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/10 blur-[100px]" />

          <div className="relative z-10 max-w-2xl">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <p className="text-xl font-medium text-destructive">
              Critical System Error
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Something went seriously wrong
            </h1>
            <p className="mt-6 text-lg leading-7 text-muted-foreground">
              A critical error occurred in the application core. Please try
              refreshing the page.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                onClick={() =>
                  typeof reset === "function"
                    ? reset()
                    : window.location.reload()
                }
                size="lg"
                className="rounded-full px-8 transition-all hover:scale-105"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>

            {error.digest && (
              <p className="mt-8 text-xs text-muted-foreground/50 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
