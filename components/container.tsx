"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "narrow" | "wide" | "full";
}

export function Container({
  children,
  className,
  variant = "default",
}: ContainerProps) {
  const variants = {
    default: "max-w-7xl",
    narrow: "max-w-4xl",
    wide: "max-w-screen-2xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8 w-full",
        variants[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
