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
  const { theme, setTheme } = useTheme();

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl hover:bg-accent text-muted-foreground transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="mt-2">
        {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      </TooltipContent>
    </Tooltip>
  );
}
