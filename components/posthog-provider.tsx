"use client";

import { useEffect, Suspense } from "react";
import { posthog } from "@/lib/posthog-client";
import { initPostHog } from "@/instrumentation-client";
import { authClient } from "@/lib/auth-client";
import { usePathname, useSearchParams } from "next/navigation";

function PostHogTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

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
      <Suspense fallback={null}>
        <PostHogTracker />
      </Suspense>
      {children}
    </>
  );
}
