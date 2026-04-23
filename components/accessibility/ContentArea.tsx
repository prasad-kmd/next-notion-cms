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
        .accessibility-content-area,
        .accessibility-content-area * {
          font-family: var(--a11y-font-family, inherit) !important;
        }
      `}</style>
      <style jsx global>{`
        .a11y-high-contrast {
          --foreground: oklch(0% 0 0) !important;
          --background: oklch(100% 0 0) !important;
          --muted-foreground: oklch(20% 0 0) !important;
          background-color: var(--background) !important;
          color: var(--foreground) !important;
        }
        :is(.dark *) .a11y-high-contrast {
          --foreground: oklch(100% 0 0) !important;
          --background: oklch(0% 0 0) !important;
          --muted-foreground: oklch(80% 0 0) !important;
          background-color: var(--background) !important;
          color: var(--foreground) !important;
        }
        .accessibility-content-area.a11y-high-contrast,
        .accessibility-content-area.a11y-high-contrast * {
          color: var(--foreground) !important;
          border-color: var(--foreground) !important;
        }
      `}</style>
      {children}
    </div>
  );
}
