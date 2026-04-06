"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookText,
  Briefcase,
  Library,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  X,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

const primaryNav = [
  { name: "Home", href: "/", icon: Home },
  { name: "Blog", href: "/blog", icon: BookText },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Wiki", href: "/wiki", icon: Library },
];

const socialNav = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export function Navigation() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileOpen, setMobileSidebarOpen } =
    useSidebar();

  const NavItem = ({
    item,
    isCollapsed,
  }: {
    item: (typeof primaryNav)[0];
    isCollapsed: boolean;
  }) => {
    const isActive =
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href + "/"));

    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            onClick={() => setMobileSidebarOpen(false)}
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all gap-3 relative group local-jetbrains-mono",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              isCollapsed
                ? "lg:justify-center lg:px-2 lg:gap-0"
                : "justify-start",
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                "transition-opacity duration-300",
                isCollapsed
                  ? "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                  : "opacity-100",
              )}
            >
              {item.name}
            </span>
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="ml-2">
            {item.name}
          </TooltipContent>
        )}
      </Tooltip>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 border-r border-border bg-card/70 backdrop-blur-xl transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-20 w-64" : "w-64",
        )}
      >
        <div className="flex h-full flex-col relative">
          {/* Collapse Toggle Button (Desktop only) */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 z-50 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground shadow-sm transition-transform hover:scale-110 group google-sans"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border shadow-sm z-50">
              {isCollapsed ? "Expand" : "Collapse"}
            </span>
          </button>

          {/* Header */}
          <div
            className={cn(
              "border-b border-border px-6 py-6 transition-all duration-300",
              isCollapsed ? "px-4 overflow-hidden" : "px-6",
            )}
          >
            <Link
              href="/"
              className="block"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <div
                className={cn(
                  "flex items-center gap-3",
                  isCollapsed && "lg:gap-0 lg:justify-center",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center shrink-0 transition-transform duration-300",
                    isCollapsed ? "scale-110" : "scale-100",
                  )}
                >
                  <Image
                    src="/favicon.ico"
                    alt="Logo"
                    width={24}
                    height={24}
                    className="rounded-sm"
                  />
                </div>
                {!isCollapsed && (
                  <div className="animate-in fade-in slide-in-from-left-2 duration-300 hidden lg:block">
                    <h1 className="text-xl font-bold text-balance leading-tight mozilla-headline">
                      Blogfolio
                    </h1>
                    <p className="mt-1 text-xs text-muted-foreground google-sans">
                      Engineering Portfolio
                    </p>
                  </div>
                )}
                {/* Always show on mobile logo */}
                <div className="lg:hidden">
                  <h1 className="text-xl font-bold text-balance leading-tight mozilla-headline">
                    Blogfolio
                  </h1>
                </div>
              </div>
            </Link>
          </div>

          {/* Primary Nav */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-1 scrollbar-none">
            <div
              className={cn(
                "mb-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-300",
                isCollapsed ? "opacity-0" : "opacity-100",
              )}
            >
              Menu
            </div>
            {primaryNav.map((item) => (
              <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
            ))}

            <div
              className={cn(
                "mt-8 mb-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-300",
                isCollapsed ? "opacity-0" : "opacity-100",
              )}
            >
              Socials
            </div>
            {socialNav.map((item) => (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all gap-3 relative group local-jetbrains-mono",
                      "text-muted-foreground hover:bg-muted hover:text-foreground",
                      isCollapsed
                        ? "lg:justify-center lg:px-2 lg:gap-0"
                        : "justify-start",
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span
                      className={cn(
                        "transition-opacity duration-300",
                        isCollapsed
                          ? "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                          : "opacity-100",
                      )}
                    >
                      {item.name}
                    </span>
                  </a>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="ml-2">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>

          {/* Footer info in Sidebar */}
          {(!isCollapsed || isMobileOpen) && (
            <div
              className={cn(
                "p-4 border-t border-border/40 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300",
                isCollapsed && "lg:hidden",
              )}
            >
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground font-medium google-sans">
                  © 2025 PrasadM
                </p>
                <p className="text-[10px] text-muted-foreground/60 google-sans">
                  Built with Next.js & Tailwind
                </p>
              </div>
            </div>
          )}

          {isCollapsed && !isMobileOpen && (
            <div className="p-4 border-t border-border/40 flex items-center justify-center transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] text-muted-foreground font-bold google-sans">
                PM
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
