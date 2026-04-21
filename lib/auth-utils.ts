import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "./auth-client";
import { Session } from "@/types/auth";

/**
 * Server-side check if a session belongs to an admin
 */
export function isAdmin(session: Session | null): boolean {
    return session?.user?.role === "admin";
}

/**
 * Server component helper to require admin access
 * Throws redirect if not authorized
 */
export async function requireAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        // Redirect to sign-in with callback URL
        const headerList = await headers();
        const referer = headerList.get("referer");
        let callbackUrl = "/";

        if (referer) {
            try {
                callbackUrl = new URL(referer).pathname;
            } catch (e) {
                // Ignore parsing errors
            }
        }
        
        redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    if (session.user.role !== "admin") {
        redirect("/not-authorized");
    }

    return session;
}

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
