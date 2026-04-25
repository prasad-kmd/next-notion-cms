"use client";

import posthog from "posthog-js";

if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).posthog = posthog;
}

// The initialization logic is now handled in instrumentation-client.ts in the root
// We export the posthog instance for use in components
export { posthog };
