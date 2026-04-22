"use client";

import posthog from "posthog-js";

// The initialization logic is now handled in instrumentation-client.ts in the root
// We export the posthog instance for use in components
export { posthog };
