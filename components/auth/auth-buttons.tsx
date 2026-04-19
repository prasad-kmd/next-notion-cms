"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { 
    Github, 
    Chrome, 
    Facebook, 
    Twitter, 
    Database, 
    Layout, 
    Ghost,
    LogOut,
    User
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInButtons() {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleSignIn = async (provider: "google" | "github" | "facebook" | "twitter" | "reddit") => {
        setIsLoading(provider);
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: window.location.origin,
            });
        } catch (error) {
            toast.error(`Failed to sign in with ${provider}`);
            console.error(error);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full max-w-sm">
            <Button 
                variant="outline" 
                onClick={() => handleSignIn("google")}
                disabled={!!isLoading}
                className="flex items-center gap-2"
            >
                <Chrome className="w-4 h-4" />
                <span>Continue with Google</span>
            </Button>
            
            <Button 
                variant="outline" 
                onClick={() => handleSignIn("github")}
                disabled={!!isLoading}
                className="flex items-center gap-2"
            >
                <Github className="w-4 h-4" />
                <span>Continue with GitHub</span>
            </Button>

            {/* Other providers can be added here, conditionally if desired */}
        </div>
    );
}

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function UserMenu({ isMobile = false }: { isMobile?: boolean }) {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) return <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />;

    if (!session) {
        return (
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => (window.location.href = "/sign-in")}
                        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative group google-sans"
                        aria-label="Sign In"
                    >
                        <User className="h-5 w-5" />
                    </button>
                </TooltipTrigger>
                {!isMobile && (
                    <TooltipContent side="bottom" sideOffset={8}>
                        Sign In
                    </TooltipContent>
                )}
            </Tooltip>
        );
    }

    return (
        <div className="flex items-center gap-1">
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <button
                        className="p-0.5 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                        aria-label="User profile"
                    >
                        <img
                            src={session.user.image || `https://avatar.vercel.sh/${session.user.email}`}
                            alt={session.user.name}
                            className="w-8 h-8 rounded-full border border-border object-cover"
                        />
                    </button>
                </TooltipTrigger>
                {!isMobile && (
                    <TooltipContent side="bottom" sideOffset={8} className="flex flex-col gap-1">
                        <p className="font-medium">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </TooltipContent>
                )}
            </Tooltip>

            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <button
                        onClick={async () => {
                            await authClient.signOut();
                            window.location.reload();
                        }}
                        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Sign Out"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </TooltipTrigger>
                {!isMobile && (
                    <TooltipContent side="bottom" sideOffset={8}>
                        Sign Out
                    </TooltipContent>
                )}
            </Tooltip>
        </div>
    );
}
