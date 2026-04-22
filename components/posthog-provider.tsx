"use client";

import { useEffect, Suspense } from "react";
import { posthog } from "@/lib/posthog-client";
import { initPostHog } from "@/instrumentation-client";
import { authClient } from "@/lib/auth-client";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    initPostHog();
  }, []);

  // Identify user
  useEffect(() => {
    if (session?.user && posthog) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      });
    } else if (!session && posthog) {
      posthog.reset();
    }
  }, [session]);

  return (
    <>
      {children}
    </>
  );
}
