import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utility functions", () => {
  describe("cn", () => {
    it("merges classes correctly", () => {
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
      expect(cn("px-2 py-1", "p-4")).toBe("p-4"); // tailwind-merge in action
    });

    it("handles conditional classes", () => {
      expect(cn("base", true && "true-class", false && "false-class")).toBe("base true-class");
    });
  });
});
