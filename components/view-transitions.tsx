"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");

      if (
        link &&
        link.href &&
        link.origin === window.location.origin &&
        !link.hasAttribute("download") &&
        link.target !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // Only trigger if View Transitions API is supported
        if ("startViewTransition" in document) {
          const href = link.getAttribute("href");
          const url = new URL(link.href);
          
          // Normalize paths to handle trailing slashes during comparison
          const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
          const targetPath = url.pathname.replace(/\/$/, "") || "/";
          
          const isHashLink = href?.startsWith("#") || (targetPath === currentPath && url.hash !== "");
          
          // Completely bypass view transitions for local hash jumps
          if (isHashLink) {
            e.preventDefault();
            const id = url.hash.substring(1);
            const target = document.getElementById(id);
            if (target) {
              target.scrollIntoView({ behavior: "smooth" });
              // Update URL without triggering a full navigation transition
              window.history.pushState(null, "", link.href);
            }
            return;
          }

          e.preventDefault();

          // @ts-ignore - View Transition API might not be in the TS types yet
          document.startViewTransition(() => {
            router.push(link.href);
          });
        }
      }
    };

    window.addEventListener("click", handleLinkClick, { capture: true });
    return () =>
      window.removeEventListener("click", handleLinkClick, { capture: true });
  }, [router]);

  return <>{children}</>;
}
