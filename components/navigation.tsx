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
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

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
  const { isCollapsed, toggleSidebar, isMobileOpen, setMobileSidebarOpen } = useSidebar();

  const NavItem = ({ item, isCollapsed }: { item: typeof primaryNav[0], isCollapsed: boolean }) => {
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

    return (
      <Link
        href={item.href}
        onClick={() => setMobileSidebarOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200", !isActive && "group-hover:scale-110")} />
        <span className={cn(
          "transition-all duration-300 overflow-hidden whitespace-nowrap",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}>
          {item.name}
        </span>
        {isCollapsed && (
          <div className="fixed left-[80px] px-2.5 py-1.5 bg-popover text-popover-foreground text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-[100] shadow-xl border border-border/50 backdrop-blur-md">
            {item.name}
          </div>
        )}
      </Link>
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
          "fixed top-0 left-0 z-50 h-screen bg-background/60 backdrop-blur-xl border-r border-border/50 transition-all duration-300 ease-in-out flex flex-col",
          isCollapsed ? "w-[70px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/40">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 font-bold text-xl tracking-tight transition-all duration-300",
              isCollapsed && "opacity-0 w-0 pointer-events-none"
            )}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              B
            </div>
            <span>Blogfolio</span>
          </Link>

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent text-muted-foreground transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-1 scrollbar-none">
          <div className={cn(
            "mb-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-300",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}>
            Menu
          </div>
          {primaryNav.map((item) => (
            <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
          ))}

          <div className={cn(
            "mt-8 mb-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-300",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}>
            Socials
          </div>
          {socialNav.map((item) => (
             <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className={cn(
                "transition-all duration-300 overflow-hidden whitespace-nowrap",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                {item.name}
              </span>
              {isCollapsed && (
                <div className="fixed left-[80px] px-2.5 py-1.5 bg-popover text-popover-foreground text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-[100] shadow-xl border border-border/50 backdrop-blur-md">
                  {item.name}
                </div>
              )}
            </a>
          ))}
        </nav>

        {/* Footer info in Sidebar */}
        <div className={cn(
          "p-4 border-t border-border/40 transition-all duration-300",
          isCollapsed ? "items-center" : ""
        )}>
          {!isCollapsed ? (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground font-medium">© 2025 PrasadM</p>
              <p className="text-[10px] text-muted-foreground/60">Built with Next.js & Tailwind</p>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] text-muted-foreground font-bold">
              PM
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
