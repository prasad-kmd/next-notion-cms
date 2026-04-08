import { PanelLeft } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 px-6 text-center lg:min-h-screen">
            <div className="relative">
                {/* Pulsing ring around the icon */}
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-lg border border-border">
                    <PanelLeft className="h-8 w-8 text-primary animate-pulse" />
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-bold mozilla-headline animate-pulse tracking-wide text-foreground">
                    &copy; PrasadM 2026
                </h2>
                <div className="flex items-center justify-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
                    Initializing Webapp
                </p>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,var(--primary)_0%,transparent_50%)] opacity-[0.03]" />
        </div>
    )
}
