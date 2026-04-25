"use client";

import { authClient } from "@/lib/auth-client";
// import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const handleSignOut = async () => {
        setIsPending(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/");
                        router.refresh();
                    },
                },
            });
        } catch (error) {
            console.error("Sign out failed", error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            disabled={isPending}
            className="inline-flex w-full items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/10 disabled:opacity-50"
        >
            {isPending ? "Signing out..." : "Sign Out"}
        </button>
    );
}
