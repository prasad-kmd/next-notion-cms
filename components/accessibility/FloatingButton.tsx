"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Accessibility, GripVertical } from "lucide-react";
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
  const { isPanelOpen, updateSetting, isCollapsed, buttonPosition } = useAccessibility();
  const pathname = usePathname();
  const [position, setPosition] = useState(buttonPosition || { x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startMousePos = useRef({ x: 0, y: 0 });

  const isVisible = CONTENT_ROUTES.some((route) => pathname?.startsWith(route));

  useEffect(() => {
    if (buttonPosition) {
      setPosition(buttonPosition);
    } else {
      // Default position: bottom right
      setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    }
  }, [buttonPosition]);


  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setIsDragging(true);
    setHasMoved(false);
    startMousePos.current = { x: clientX, y: clientY };
    dragStartPos.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  };

  const onMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    // Check if we've moved enough to be considered a drag
    const dx = clientX - startMousePos.current.x;
    const dy = clientY - startMousePos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      setHasMoved(true);
    }

    if (!hasMoved && distance <= 5) return;

    let newX = clientX - dragStartPos.current.x;
    let newY = clientY - dragStartPos.current.y;

    // Constraints
    const padding = 20;
    const buttonWidth = buttonRef.current?.offsetWidth || 0;
    const buttonHeight = buttonRef.current?.offsetHeight || 0;

    newX = Math.max(padding, Math.min(newX, window.innerWidth - buttonWidth - padding));
    newY = Math.max(padding, Math.min(newY, window.innerHeight - buttonHeight - padding));

    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (hasMoved) {
        updateSetting("buttonPosition", position);
      }
    }
  }, [isDragging, hasMoved, position, updateSetting]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onMouseMove);
      window.addEventListener("touchend", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  if (!isVisible || position.x === -1) return null;

  return (
    <div
      ref={buttonRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
      }}
      className="group flex items-center gap-2 rounded-xl border border-border bg-background/80 p-1.5 shadow-lg backdrop-blur-md w-auto"
    >
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
        className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <button
        onClick={() => updateSetting("isPanelOpen", !isPanelOpen)}
        className="flex items-center gap-2 rounded-lg bg-primary p-2 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        aria-label="Toggle Accessibility Panel"
        aria-expanded={isPanelOpen}
      >
        <Accessibility className="h-5 w-5" />
        <span className="pr-2 text-sm font-medium font-mono">A11Y</span>
      </button>
    </div>
  );
}
