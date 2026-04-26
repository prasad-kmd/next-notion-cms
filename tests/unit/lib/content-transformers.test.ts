import { describe, it, expect } from "vitest";
import { injectHeadingIds, injectQuiz, injectAlerts, sanitizeContent } from "@/lib/content/transformers";

describe("Content Transformers", () => {
  describe("injectHeadingIds", () => {
    it("should inject IDs into headings", () => {
      const html = "<h2>Hello World</h2>";
      expect(injectHeadingIds(html)).toContain('id="hello-world"');
    });

    it("should not overwrite existing IDs", () => {
      const html = '<h2 id="existing">Hello</h2>';
      expect(injectHeadingIds(html)).toBe(html);
    });
  });

  describe("injectAlerts", () => {
    it("should transform NOTE alerts", () => {
      const html = "<blockquote><p>[!NOTE] This is a note</p></blockquote>";
      expect(injectAlerts(html)).toContain("blue-500");
      expect(injectAlerts(html)).toContain("NOTE");
    });

    it("should transform WARNING alerts", () => {
      const html = "<blockquote><p>[!WARNING] This is a warning</p></blockquote>";
      expect(injectAlerts(html)).toContain("yellow-500");
      expect(injectAlerts(html)).toContain("WARNING");
    });
  });

  describe("sanitizeContent", () => {
    it("should remove script tags", () => {
      const html = "<p>Hello</p><script>alert('xss')</script>";
      expect(sanitizeContent(html)).toBe("<p>Hello</p>");
    });

    it("should preserve GitHub Gists", () => {
      const gistScript = '<script src="https://gist.github.com/user/123.js"></script>';
      expect(sanitizeContent(gistScript)).toBe(gistScript);
    });

    it("should handle nested script tags", () => {
        const html = "<scr<script>ipt>alert(1)</script>";
        expect(sanitizeContent(html)).not.toContain("<script");
    });
  });
});
