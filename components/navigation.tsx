"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  BookOpen,
  FolderGit2,
  LibraryBig,
  LayoutPanelLeft,
  MailSearch,
  ChevronLeft,
  ChevronRight,
  UserStar,
  BadgeInfo,
  Book,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { WebShareButton } from "./web-share-button";
import { PushNotificationManager } from "./push-notification-manager";
import { useSidebar } from "./sidebar-context";
import { MobileBottomNav } from "./mobile-bottom-nav";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

function MobileTopBanner() {
  return (
    <div data-pdf-exclude className="fixed top-0 left-0 right-0 z-40 lg:hidden h-14 overflow-hidden border-b border-border/40">
      {/* Dynamic Background Animation */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
            x: [0, 10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-full -left-1/4 w-[150%] h-[300%] bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.08)_0%,transparent_50%)]"
        />
      </div>

      <div className="relative h-full flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="text-sm font-black tracking-[0.4rem] uppercase mozilla-headline bg-linear-to-r from-primary via-secondary to-primary bg-size-[200%_auto] bg-clip-text text-transparent"
          >
            PrasadM
          </motion.span>
          <div className="flex gap-1.5 mt-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className="w-0.5 h-1.5 bg-primary/40 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Scanning Line */}
      <motion.div
        animate={{ x: ["-300%", "300%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-1/3 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"
      />
    </div>
  );
}

const primaryNav = [
  { name: "Home", href: "/", icon: LayoutPanelLeft },
  { name: "Portfolio", href: "/portfolio", icon: UserStar },
  { name: "Blog", href: "/blog", icon: FileText },
  { name: "Articles", href: "/articles", icon: BookOpen },
  { name: "Projects", href: "/projects", icon: FolderGit2 },
  { name: "Wiki", href: "/wiki", icon: Book },
  { name: "Tutorials", href: "/tutorials", icon: LibraryBig },
];

const secondaryNav = [
  { name: "Authors", href: "/authors", icon: UserStar },
  { name: "About", href: "/about", icon: BadgeInfo },
  { name: "Contact", href: "/contact", icon: MailSearch },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();

  const renderNavItem = (item: {
    name: string;
    href: string;
    icon: React.ElementType;
  }) => {
    const isActive =
      pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Tooltip key={item.name} delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
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
      <MobileTopBanner />
      <MobileBottomNav
        isSidebarOpen={mobileMenuOpen}
        onToggleSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Sidebar */}
      <aside
        data-pdf-exclude
        className={cn(
          "fixed inset-y-0 left-0 z-40 border-r border-border bg-card/70 backdrop-blur-xl transition-all duration-300 ease-in-out lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-20 w-64" : "w-64",
        )}
      >
        <div className="flex h-full flex-col relative">
          {/* Collapse Toggle Button (Desktop only) */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 z-50 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground shadow-sm transition-transform hover:scale-110 group google-sans"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
          {/* Logo */}
          <div
            className={cn(
              "border-b border-border px-6 py-6 transition-all duration-300",
              isCollapsed ? "px-4 overflow-hidden" : "px-6",
            )}
          >
            <Link
              href="/"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div
                className={cn(
                  "flex items-center gap-3",
                  isCollapsed && "lg:gap-0 lg:justify-center",
                )}
              >
                <Image
                  src="/img/favicon/favicon-128.png"
                  alt="Logo"
                  width={24}
                  height={24}
                  className={cn(
                    "h-6 w-6 shrink-0 transition-transform",
                    isCollapsed && "scale-110",
                  )}
                />
                {!isCollapsed && (
                  <div className="animate-in fade-in slide-in-from-left-2 duration-300 hidden lg:block">
                    <h1 className="text-xl font-bold text-balance leading-tight mozilla-headline">
                      PrasadM
                    </h1>
                    <p className="mt-1 text-xs text-muted-foreground google-sans">
                      Engineering Undergraduate
                    </p>
                  </div>
                )}
                {/* Always show on mobile logo */}
                <div className="lg:hidden">
                  <h1 className="text-xl font-bold text-balance leading-tight mozilla-headline">
                    PrasadM
                  </h1>
                  <p className="mt-1 text-xs text-muted-foreground"></p>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {primaryNav.map(renderNavItem)}
            <hr className="my-2 border-border" />
            <PushNotificationManager isCollapsed={isCollapsed} />
            <WebShareButton isCollapsed={isCollapsed} />
            <hr className="my-2 border-border" />
            {secondaryNav.map(renderNavItem)}
          </nav>

          {/* Footer */}
          {(!isCollapsed || mobileMenuOpen) && (
            <div
              className={cn(
                "border-t border-border px-6 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                isCollapsed && "lg:hidden",
              )}
            >
              <p className="text-xs text-muted-foreground google-sans">
                &copy; PrasadM
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Spacer for mobile bottom navbar */}
      <div className="h-12 lg:hidden" />
    </>
  );
}
