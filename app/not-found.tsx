import Link from "next/link"
import { Home, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center sm:py-32 lg:px-8">
            {/* Background Decor */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--primary)_0%,transparent_100%)] opacity-[0.05]" />
            <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

            <div className="relative z-10">
                <p className="text-6xl font-bold text-primary mozilla-headline">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl amoriaregular">
                    Page Not Found
                </h1>
                <p className="mt-6 text-lg leading-7 text-muted-foreground max-w-lg mx-auto">
                    The page you are looking for might have been removed, had its name changed,
                    or is temporarily unavailable.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button asChild size="lg" className="rounded-full px-8 transition-all hover:scale-105">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>

                    <Button asChild variant="outline" size="lg" className="rounded-full px-8 transition-all hover:scale-105">
                        <Link href="/tools">
                            <Search className="mr-2 h-4 w-4" />
                            Explore Tools
                        </Link>
                    </Button>
                </div>

                <div className="mt-16">
                    <Link
                        href="/"
                        className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Go back to previous page
                    </Link>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute top-10 right-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
        </div>
    )
}
