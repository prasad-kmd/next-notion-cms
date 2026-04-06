"use client";

import React, { useState, useEffect } from "react";
import { Menu, Search, Sun, Moon, Settings, Bell, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./theme/theme-toggle";

export function FloatingNavbar() {
  const { toggleMobileSidebar } = useSidebar();
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none",
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center h-16 pointer-events-none">
        {/* Mobile Menu Trigger */}
        <div className="lg:hidden flex items-center h-full pointer-events-auto">
          <button
            onClick={toggleMobileSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-xl border border-border/50 text-foreground shadow-lg shadow-black/5 hover:bg-accent transition-all"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Action Bar (Aligned to the right) */}
        <div className="flex items-center gap-3 pointer-events-auto ml-auto">
          {/* Icon Buttons */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5">
            <ThemeToggle />

            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-accent text-muted-foreground transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </button>

            <div className="w-px h-4 bg-border/60 mx-1" />

            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20">
              <User size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
