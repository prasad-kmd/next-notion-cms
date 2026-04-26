import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  route?: string;
}

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AccessibilityProvider>
        {children}
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: ExtendedRenderOptions,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
