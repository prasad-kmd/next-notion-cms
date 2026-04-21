import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogIn, UserX, Home } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function NotAuthorizedPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Background geometric element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
            
            <div className="max-w-md w-full text-center">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-destructive/20 rounded-2xl blur opacity-20" />
                        <div className="relative h-20 w-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-xl">
                            <ShieldAlert className="h-10 w-10 text-destructive/80" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight mb-2 philosopher amoriaregular">
                    Access Restricted
                </h1>
                <p className="text-muted-foreground mb-8 text-sm uppercase tracking-widest font-mono">
                    Authorization Error 403
                </p>
                
                <div className="p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-md shadow-2xl mb-8 relative overflow-hidden group">
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    {!session ? (
                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <LogIn className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-3 amoriaregular">Administrator Access Only</h2>
                            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                                This section of the workspace contains sensitive project roadmaps and internal configurations. Please sign in with an authorized account.
                            </p>
                            <Link
                                href="/sign-in"
                                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
                            >
                                Sign In to Workspace
                            </Link>
                        </div>
                    ) : (
                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="p-3 rounded-full bg-destructive/10">
                                    <UserX className="h-6 w-6 text-destructive" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-3 amoriaregular">Insufficient Privileges</h2>
                            <div className="mb-6">
                                <p className="text-xs text-muted-foreground uppercase tracking-tighter mb-1 font-mono">Signed in as</p>
                                <div className="font-mono text-xs bg-muted/50 py-2 px-4 rounded-lg border border-border/50 inline-block truncate max-w-full">
                                    {session.user.email}
                                </div>
                            </div>
                            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                                Your current technical role does not have the permissions required to access this endpoint. Please contact the system administrator if you believe this is an error.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-all hover:bg-muted hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Home className="h-4 w-4" />
                                    Home
                                </Link>
                                <SignOutButton />
                            </div>
                        </div>
                    )}
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Return to dashboard
                </Link>
            </div>
        </div>
    );
}
