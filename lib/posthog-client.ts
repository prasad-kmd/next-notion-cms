"use client";

import posthog from "posthog-js";

if (typeof window !== "undefined") {
  // @ts-expect-error - PostHog instance on window for debugging
  window.posthog = posthog;
}

// The initialization logic is now handled in instrumentation-client.ts in the root
// We export the posthog instance for use in components
export { posthog };
