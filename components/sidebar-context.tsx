"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsCollapsed(savedState === "true");
    }
    setIsInitialized(true);
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("sidebar-collapsed", String(isCollapsed));

      // Update a CSS variable on the document for easy styling
      if (isCollapsed) {
        document.documentElement.classList.add("sidebar-collapsed");
      } else {
        document.documentElement.classList.remove("sidebar-collapsed");
      }
    }
  }, [isCollapsed, isInitialized]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const setCollapsed = (collapsed: boolean) => setIsCollapsed(collapsed);
  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
  const setMobileSidebarOpen = (open: boolean) => setIsMobileOpen(open);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggleSidebar,
        setCollapsed,
        toggleMobileSidebar,
        setMobileSidebarOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
