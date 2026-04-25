"use client";

import { useEffect, useState } from "react";

export type AccentColor = {
  name: string;
  h: number;
  s: string;
  l: string;
  className: string;
};

export const ACCENT_COLORS: AccentColor[] = [
  { name: "Core", h: 181, s: "100%", l: "28%", className: "bg-[#008f91]" },
  { name: "Royal Blue", h: 221, s: "83%", l: "53%", className: "bg-blue-600" },
  { name: "Emerald", h: 160, s: "84%", l: "39%", className: "bg-emerald-600" },
  { name: "Sunset", h: 20, s: "90%", l: "50%", className: "bg-orange-500" },
  { name: "Rose", h: 330, s: "81%", l: "60%", className: "bg-rose-500" },
  { name: "Violet", h: 262, s: "83%", l: "58%", className: "bg-violet-600" },
  { name: "Indigo", h: 240, s: "75%", l: "60%", className: "bg-indigo-600" },
  { name: "Cyan", h: 190, s: "90%", l: "45%", className: "bg-cyan-500" },
];

export function useAccentColor() {
  const [accentColor, setAccentColor] = useState<AccentColor>(ACCENT_COLORS[0]);

  const applyAccentColor = (color: AccentColor) => {
    const root = document.documentElement;
    root.style.setProperty("--primary-h", color.h.toString());
    root.style.setProperty("--primary-s", color.s);
    root.style.setProperty("--primary-l", color.l);
    localStorage.setItem("accent-color", color.name);
  };

  useEffect(() => {
    const saved = localStorage.getItem("accent-color");
    if (saved) {
      const found = ACCENT_COLORS.find((c) => c.name === saved);
      if (found) {
        setAccentColor(found);
        applyAccentColor(found);
      }
    }
  }, []);

  const updateAccentColor = (color: AccentColor) => {
    setAccentColor(color);
    applyAccentColor(color);
  };

  return {
    accentColor,
    updateAccentColor,
    ACCENT_COLORS,
  };
}
