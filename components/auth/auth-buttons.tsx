"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { 
    Layout, 
    LogOut,
    User
} from "lucide-react";
import { 
    SiGoogle, 
    SiGithub, 
    SiFacebook, 
    SiX, 
    SiReddit 
} from "react-icons/si";
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
                className="flex items-center gap-3 h-12 rounded-xl transition-all hover:bg-blue-500/5 hover:border-blue-500/30"
            >
                <SiGoogle className="w-5 h-5 text-[#4285F4]" />
                <span className="font-semibold">Continue with Google</span>
            </Button>
            
            <Button 
                variant="outline" 
                onClick={() => handleSignIn("github")}
                disabled={!!isLoading}
                className="flex items-center gap-3 h-12 rounded-xl transition-all hover:bg-zinc-500/5 hover:border-zinc-500/30"
            >
                <SiGithub className="w-5 h-5" />
                <span className="font-semibold">Continue with GitHub</span>
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function UserMenu({ isMobile = false }: { isMobile?: boolean }) {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="p-0.5 rounded-full hover:ring-2 hover:ring-primary/20 transition-all outline-none"
                    aria-label="User profile"
                >
                    <img
                        src={session.user.image || `https://avatar.vercel.sh/${session.user.email}`}
                        alt={session.user.name}
                        className="w-8 h-8 rounded-full border border-border object-cover"
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 google-sans">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {session.user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer"
                >
                    <Layout className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={async () => {
                        await authClient.signOut();
                        router.refresh();
                    }}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
