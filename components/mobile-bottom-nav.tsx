"use client";

import { useTheme } from "next-themes";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AccentPicker } from "./accent-picker";
import { UserMenu } from "./auth/auth-buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MobileBottomNavProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  className?: string;
}

export function MobileBottomNav({
  onToggleSidebar,
  isSidebarOpen,
  className,
}: MobileBottomNavProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      data-print-hide="true"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-1.5 border-t border-border bg-background/80 backdrop-blur-xl shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.1)] w-full lg:hidden rounded-t-[2.5rem]",
        className,
      )}
    >
      {/* Search */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href="/search"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={12}>
          Search
        </TooltipContent>
      </Tooltip>

      {/* Accent Picker */}
      <AccentPicker side="top" />

      {/* Sidebar Toggle */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors group"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={12}>
          {isSidebarOpen ? "Close Menu" : "Open Menu"}
        </TooltipContent>
      </Tooltip>

      {/* Theme Toggle */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 animate-in zoom-in-50 duration-300" />
            ) : (
              <Moon className="h-5 w-5 animate-in zoom-in-50 duration-300" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={12}>
          Toggle Theme
        </TooltipContent>
      </Tooltip>

      {/* User / Profile */}
      <UserMenu isMobile={true} dropdownSide="top" />
    </div>
  );
}
