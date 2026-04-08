"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9" />
    );
  }

  const currentTheme = resolvedTheme || theme;

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl hover:bg-accent text-muted-foreground transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none overflow-hidden"
          aria-label="Toggle theme"
        >
          <div className="relative h-5 w-5">
            <Sun className={`h-full w-full transition-all duration-500 absolute top-0 left-0 ${currentTheme === "dark" ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
            <Moon className={`h-full w-full transition-all duration-500 absolute top-0 left-0 ${currentTheme === "light" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="mt-2">
        {currentTheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      </TooltipContent>
    </Tooltip>
  );
}
