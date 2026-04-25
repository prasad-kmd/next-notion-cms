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
        capture_pageview: false, // Disabling automatic tracking to prevent double-counting with manual triggers
        capture_performance: true,
        defaults: "2026-01-30",
        autocapture: true,
        persistence: "localStorage",
        // Enable session recording if host is configured
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: ".mask-text",
        },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        loaded: (ph: any) => {
          if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).posthog = ph;
          }
        },
      });
    } else {
      console.warn("PostHog key missing. Analytics disabled.");
    }
  }
}
