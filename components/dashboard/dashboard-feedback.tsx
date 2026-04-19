"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function DashboardFeedback() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const error = searchParams.get("error");
        const message = searchParams.get("message");

        if (error) {
            toast.error(error);
            // Clean up URL
            const params = new URLSearchParams(searchParams.toString());
            params.delete("error");
            router.replace(`/dashboard${params.toString() ? `?${params.toString()}` : ""}`);
        } else if (message) {
            toast.success(message);
            // Clean up URL
            const params = new URLSearchParams(searchParams.toString());
            params.delete("message");
            router.replace(`/dashboard${params.toString() ? `?${params.toString()}` : ""}`);
        }
        
        // Better Auth might pass error in hash or other params depending on config
        // but standard linking success usually returns to the callbackURL.
    }, [searchParams, router]);

    return null;
}
