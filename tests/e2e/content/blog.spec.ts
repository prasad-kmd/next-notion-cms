import { test, expect } from "@playwright/test";

test.describe("Blog Page", () => {
  test("should load the blog listing page", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle(/Blog/i);
    // Add more specific assertions based on actual content
  });

  test("should navigate to a blog post", async ({ page }) => {
    await page.goto("/blog");
    // Find the first blog post link and click it
    // await page.click('a[href^="/blog/"]');
    // await expect(page.url()).toContain("/blog/");
  });
});
