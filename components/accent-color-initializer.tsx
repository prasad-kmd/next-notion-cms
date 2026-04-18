"use client";

import { useEffect } from "react";
import { ACCENT_COLORS } from "@/hooks/use-accent-color";

export function AccentColorInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem("accent-color");
    if (saved) {
      const found = ACCENT_COLORS.find((c) => c.name === saved);
      if (found) {
        const root = document.documentElement;
        root.style.setProperty("--primary-h", found.h.toString());
        root.style.setProperty("--primary-s", found.s);
        root.style.setProperty("--primary-l", found.l);
      }
    }
  }, []);

  return null;
}
