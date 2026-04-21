"use client";

import { useAccentColor, ACCENT_COLORS } from "@/hooks/use-accent-color";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AccentPicker({ side = "bottom" }: { side?: "top" | "bottom" }) {
  const { accentColor, updateAccentColor } = useAccentColor();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "p-2 rounded-full transition-all group relative",
              isOpen ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
            aria-label="Change accent color"
          >
            <Palette className="h-5 w-5" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background shadow-sm"
              style={{ backgroundColor: `hsl(${accentColor.h} ${accentColor.s} ${accentColor.l})` }}
              layoutId="accent-indicator"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} sideOffset={8}>
          Accent Color
        </TooltipContent>
      </Tooltip>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: side === "bottom" ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "bottom" ? 10 : -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "absolute p-3 rounded-2xl border border-border bg-background/80 backdrop-blur-xl shadow-2xl z-70 min-w-[200px]",
              side === "bottom" 
                ? "top-full right-0 mt-3" 
                : "bottom-full left-0 mb-3 top-auto"
            )}
          >
            <div className="mb-2 px-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground google-sans">
                Select Accent
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ACCENT_COLORS.map((color) => {
                const isActive = accentColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => {
                      updateAccentColor(color);
                      // Don't close immediately to let user see selection
                    }}
                    className={cn(
                      "group relative flex h-8 w-8 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95",
                      color.className
                    )}
                    title={color.name}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-check"
                        className="text-white"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
