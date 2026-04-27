"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  startTransition,
} from "react";

export type FontOption = {
  name: string;
  variable: string;
  label: string;
};

export const AVAILABLE_FONTS: FontOption[] = [
  {
    name: "default",
    variable: "var(--font-google-sans)",
    label: "Default (Google Sans)",
  },
  { name: "inter", variable: "var(--font-local-inter)", label: "Inter" },
  { name: "serif", variable: "var(--font-noto-serif-sinhala)", label: "Serif" },
  {
    name: "mono",
    variable: "var(--font-local-jetbrains-mono)",
    label: "JetBrains Mono",
  },
  { name: "amoria", variable: "var(--font-amoria-regular)", label: "Amoria" },
  {
    name: "mozilla",
    variable: "var(--font-mozilla-text)",
    label: "Mozilla Text",
  },
  { name: "roboto", variable: "var(--font-roboto)", label: "Roboto" },
  {
    name: "space-mono",
    variable: "var(--font-space-mono)",
    label: "Space Mono",
  },
];

export interface AccessibilitySettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  wordSpacing: number;
  letterSpacing: number;
  isHighContrast: boolean;
  isPanelOpen: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ) => void;
  resetAllSettings: () => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 1.0,
  fontFamily: "default",
  lineHeight: 1.0,
  wordSpacing: 1.0,
  letterSpacing: 1.0,
  isHighContrast: false,
  isPanelOpen: false,
};

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider",
    );
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] =
    useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("accessibility-preferences");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        startTransition(() => {
          setSettings((prev) => ({ ...prev, ...parsed }));
        });
      } catch {
        console.error("Failed to parse accessibility preferences");
      }
    }
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (mounted) {
      const persistSettings: Partial<AccessibilitySettings> = { ...settings };
      delete persistSettings.isPanelOpen;
      localStorage.setItem(
        "accessibility-preferences",
        JSON.stringify(persistSettings),
      );
    }
  }, [settings, mounted]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetAllSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        updateSetting,
        resetAllSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
