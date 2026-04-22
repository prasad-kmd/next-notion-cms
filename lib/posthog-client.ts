"use client";

import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window !== "undefined") {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (key) {
      posthog.init(key, {
        api_host: "/ingest",
        ui_host: host,
        person_profiles: "identified_only",
        capture_pageview: false, // We'll handle this manually or via autocapture
        autocapture: true,
        persistence: "localStorage",
      });
    } else {
      console.warn("PostHog key missing. Analytics disabled.");
    }
  }
}

export { posthog };
