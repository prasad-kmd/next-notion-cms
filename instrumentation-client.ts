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
        capture_pageview: false, // We handle this manually in PostHogProvider to support App Router transitions
        autocapture: true,
        persistence: "localStorage",
        // Enable session recording if host is configured
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: ".mask-text",
        }
      });
    } else {
      console.warn("PostHog key missing. Analytics disabled.");
    }
  }
}
