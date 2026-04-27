"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-2 text-xs font-medium text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide font-local-inter",
        className,
      )}
    >
      <Link
        href="/"
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item) => (
        <div key={item.href} className="flex items-center space-x-2">
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
          {item.active ? (
            <span className="text-foreground font-bold truncate max-w-[200px]">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors capitalize"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
