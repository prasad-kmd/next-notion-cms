"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { posthog } from "@/lib/posthog-client";

interface PageViewTrackerProps {
  contentType: "blog" | "article" | "tutorial" | "project" | "wiki";
  slug: string;
  title: string;
  authorId?: string;
}

export function PageViewTracker({
  contentType,
  slug,
  title,
  authorId,
}: PageViewTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (posthog) {
      const url = window.origin + pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

      // We capture an enhanced pageview event.
      // PostHog's history_change will also capture one, but it won't have these custom properties.
      // We can use posthog.register to make these properties persistent for the session,
      // or just capture an additional event.
      // Following instructions: Call posthog.capture('$pageview', { ...properties })

      posthog.capture("$pageview", {
        $current_url: url,
        content_type: contentType,
        page_slug: slug,
        page_title: title,
        author_id: authorId,
      });

      // Also register them for subsequent events in this session
      posthog.register({
        last_content_type: contentType,
        last_page_slug: slug,
      });
    }
  }, [pathname, searchParams, contentType, slug, title, authorId]);

  return null;
}
