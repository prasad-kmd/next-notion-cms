import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vitest-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**", "tests/**/*.a11y.spec.ts", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        lines: 60,
        branches: 60,
        functions: 60,
        statements: 60,
      },
      exclude: [
        "node_modules/**",
        "tests/**",
        "**/*.d.ts",
        "**/*.config.*",
        "app/api/og/route.tsx",
      ],
    },
  },
});
