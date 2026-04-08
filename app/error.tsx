"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  RefreshCcw,
  Home,
  Monitor,
  Server,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const currentTime =
    new Date().toISOString().replace("T", " ").split(".")[0] + " UTC";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 pt-10 pb-8 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          <h1 className="inline-flex items-center gap-3 text-4xl lg:text-5xl font-light text-foreground amoriaregular">
            <span>Something went wrong</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive border border-destructive/20">
              Error 500
            </span>
          </h1>
        </div>
        <div className="text-muted-foreground">
          Visit{" "}
          <Link
            href="/"
            className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
          >
            homepage
          </Link>{" "}
          or try refreshing the page.
        </div>
        <div className="mt-2 text-sm text-muted-foreground font-mono">
          {currentTime}
        </div>
      </header>

      {/* Diagnostic Status Section */}
      <div className="my-8 border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Browser Status */}
            <div className="relative px-6 py-12 text-center md:border-r border-border overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Monitor
                      className="h-16 w-16 text-muted-foreground/40"
                      strokeWidth={1.5}
                    />
                    <div className="absolute -bottom-2 -right-2 rounded-full bg-green-500/10 p-1.5 border-2 border-background">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-1">You</div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2 mozilla-headline">
                  Browser
                </h3>
                <div className="text-lg font-medium text-green-500">
                  Working
                </div>
              </div>
            </div>

            {/* Server Status */}
            <div className="relative px-6 py-12 text-center md:border-r border-border overflow-hidden group bg-destructive/5">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Server
                      className="h-16 w-16 text-muted-foreground/40"
                      strokeWidth={1.5}
                    />
                    <div className="absolute -bottom-2 -right-2 rounded-full bg-destructive/20 p-1.5 border-2 border-background">
                      <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  Application
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2 mozilla-headline">
                  Server
                </h3>
                <div className="text-lg font-medium text-destructive">
                  Error
                </div>
              </div>
            </div>

            {/* Host Status */}
            <div className="relative px-6 py-12 text-center overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Globe
                      className="h-16 w-16 text-muted-foreground/40"
                      strokeWidth={1.5}
                    />
                    <div className="absolute -bottom-2 -right-2 rounded-full bg-green-500/10 p-1.5 border-2 border-background">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {typeof window !== "undefined"
                    ? window.location.hostname
                    : "Host"}
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2 mozilla-headline">
                  Website
                </h3>
                <div className="text-lg font-medium text-green-500">
                  Working
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="mx-auto max-w-6xl px-6 mb-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* What happened */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground mozilla-headline">
              What happened?
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              <p>
                An unexpected error occurred while processing your request. The
                application encountered an issue that prevented it from
                completing the operation.
              </p>
              <p className="text-sm">
                This could be due to a temporary glitch, invalid data, or a
                server-side issue.
              </p>
            </div>
          </div>

          {/* What can I do */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground mozilla-headline">
              What can I do?
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>Try the following steps:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                <li>Refresh the page or try again</li>
                <li>Clear your browser cache and cookies</li>
                <li>Check your internet connection</li>
                <li>If the problem persists, contact support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() =>
              typeof reset === "function" ? reset() : window.location.reload()
            }
            size="lg"
            className="rounded-full px-8 transition-all hover:scale-105"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 transition-all hover:scale-105"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-muted-foreground">
            {error.digest && (
              <>
                <span className="font-mono">
                  Error ID:{" "}
                  <strong className="font-semibold text-foreground">
                    {error.digest}
                  </strong>
                </span>
                <span className="hidden sm:inline">•</span>
              </>
            )}
            <span>
              Performance & security by{" "}
              <Link
                href="https://github.com/prasad-kmd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
              >
                GitHub
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
