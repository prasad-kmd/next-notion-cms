"use client";

import { authClient } from "./auth-client";

/**
 * Client-side hook to check if the current user is an admin
 * Uses better-auth client
 */
export function useIsAdmin() {
    const { data: session, isPending } = authClient.useSession();
    
    return {
        isAdmin: session?.user?.role === "admin",
        isPending,
        session
    };
}
