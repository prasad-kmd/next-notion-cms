"use client";

import React from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Accessibility } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const CONTENT_ROUTES = [
  "/blog/",
  "/articles/",
  "/tutorials/",
  "/projects/",
  "/wiki/",
];

export function FloatingButton() {
  const { isPanelOpen, updateSetting } = useAccessibility();
  const pathname = usePathname();

  const isVisible = CONTENT_ROUTES.some((route) => pathname?.startsWith(route));

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '5.5rem', // Placed above scroll-to-top button (2rem + 11 h-unit approx)
        right: '2rem',
        zIndex: 98,
      }}
      className="flex items-center justify-center transition-all duration-300"
    >
      <button
        onClick={() => updateSetting("isPanelOpen", !isPanelOpen)}
        className={cn(
          "flex items-center gap-2 rounded-xl bg-card border border-border p-2.5 sm:p-3 text-primary shadow-lg transition-all hover:scale-105 active:scale-95 group",
          isPanelOpen && "ring-2 ring-primary border-transparent"
        )}
        aria-label="Open Accessibility Panel"
        aria-expanded={isPanelOpen}
      >
        <Accessibility className="h-5 w-5 transition-transform group-hover:rotate-12" />
        <span className="hidden sm:inline text-xs font-bold font-mono tracking-wider uppercase">A11Y</span>
      </button>
    </div>
  );
}
