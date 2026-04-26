import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Audits", () => {
  test("homepage should not have any automatically detectable accessibility issues", async ({ page }) => {
    await page.goto("/");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("blog page should not have any automatically detectable accessibility issues", async ({ page }) => {
    await page.goto("/blog");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
