"use client";

import React, { useState, useEffect } from "react";
import { Menu, Search, Sun, Moon, Settings, Bell, User, X, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalSearchModal } from "./search";
import { BookmarksModal } from "./bookmarks-modal";
import { useSidebar } from "./sidebar-context";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./theme/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FloatingNavbar() {
  const { toggleMobileSidebar } = useSidebar();
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
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
            {useSidebar().isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Action Bar (Aligned to the right) */}
        <div className="flex items-center gap-3 pointer-events-auto ml-auto">
          {/* Icon Buttons */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5">
            <ThemeToggle />

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-accent text-muted-foreground transition-all relative"
                >
                  <Search size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="mt-2">
                Search (⌘K)
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsBookmarksOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-accent text-muted-foreground transition-all relative"
                >
                  <Bookmark size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="mt-2">
                Bookmarks
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: document.title,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-accent text-muted-foreground transition-all relative"
                >
                  <Share2 size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="mt-2">
                Share Page
              </TooltipContent>
            </Tooltip>

            <div className="w-px h-4 bg-border/60 mx-1" />

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20">
                  <User size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="mt-2">
                Profile
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <BookmarksModal isOpen={isBookmarksOpen} onClose={() => setIsBookmarksOpen(false)} />
    </header>
  );
}
