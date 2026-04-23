"use client";

import React, { useEffect, useRef } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { applyAccessibilityStyles, clearAccessibilityStyles } from "@/lib/accessibility/apply-styles";

interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentArea({ children, className = "" }: ContentAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const settings = useAccessibility();

  useEffect(() => {
    if (containerRef.current) {
      applyAccessibilityStyles(containerRef.current, settings);
    }
  }, [settings]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    return () => {
      if (currentContainer) {
        clearAccessibilityStyles(currentContainer);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`accessibility-content-area ${className}`}
      style={{
        fontSize: "var(--a11y-font-size, inherit)",
        fontFamily: "var(--a11y-font-family, inherit)",
        lineHeight: "var(--a11y-line-height, inherit)",
        wordSpacing: "var(--a11y-word-spacing, inherit)",
        letterSpacing: "var(--a11y-letter-spacing, inherit)",
      } as React.CSSProperties}
    >
      <style jsx global>{`
        .a11y-high-contrast {
          --foreground: oklch(0% 0 0) !important;
          --background: oklch(100% 0 0) !important;
          --muted-foreground: oklch(20% 0 0) !important;
        }
        .dark .a11y-high-contrast {
          --foreground: oklch(100% 0 0) !important;
          --background: oklch(0% 0 0) !important;
          --muted-foreground: oklch(80% 0 0) !important;
        }
        .accessibility-content-area.a11y-high-contrast p,
        .accessibility-content-area.a11y-high-contrast span,
        .accessibility-content-area.a11y-high-contrast h1,
        .accessibility-content-area.a11y-high-contrast h2,
        .accessibility-content-area.a11y-high-contrast h3,
        .accessibility-content-area.a11y-high-contrast h4,
        .accessibility-content-area.a11y-high-contrast h5,
        .accessibility-content-area.a11y-high-contrast h6,
        .accessibility-content-area.a11y-high-contrast li {
          color: var(--foreground) !important;
          background-color: transparent !important;
        }
      `}</style>
      {children}
    </div>
  );
}
