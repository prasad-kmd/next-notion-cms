import { PostHog } from "posthog-node";

export function PostHogServerClient() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!key) {
    console.warn("PostHog key missing. Server-side analytics disabled.");
    return null;
  }

  const posthogClient = new PostHog(key, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });

  // Note: Remember to call await posthogClient.shutdown() after sending events
  // or use posthogClient.flush() if staying alive.
  return posthogClient;
}
