"use client";

import React from "react";
import { AccessibilityProvider as Provider } from "@/contexts/AccessibilityContext";

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider>{children}</Provider>;
}
