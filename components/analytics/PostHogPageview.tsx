"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { posthog } from "@/lib/posthog-client";

function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only track if it's NOT a content page, as those are handled by PageViewTracker
    const isContentPage =
      pathname.startsWith("/blog/") ||
      pathname.startsWith("/articles/") ||
      pathname.startsWith("/tutorials/") ||
      pathname.startsWith("/projects/") ||
      pathname.startsWith("/wiki/");

    if (posthog && !isContentPage) {
      const url = window.origin + pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogPageviewWrapper() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
