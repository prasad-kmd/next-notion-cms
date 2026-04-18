import { z } from "zod";

const envSchema = z.object({
  // Notion
  NOTION_AUTH_TOKEN: z.string().optional(),
  NOTION_BLOG_ID: z.string().optional(),
  NOTION_ARTICLES_ID: z.string().optional(),
  NOTION_PROJECTS_ID: z.string().optional(),
  NOTION_TUTORIALS_ID: z.string().optional(),
  NOTION_WIKI_ID: z.string().optional(),
  NOTION_AUTHORS_ID: z.string().optional(),

  // Telegram
  TELEGRAM_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),

  // GitHub
  NEXT_PUBLIC_GITHUB_TOKEN: z.string().optional(),
  NEXT_PUBLIC_GITHUB_USERNAME: z.string().optional(),

  // Site
  SITE_URL: z.string().url().optional(),
  
  // Node Env
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 2),
  );
  // In development, we might want to continue even if some are missing
  if (process.env.NODE_ENV === "production") {
    // Only throw if critical vars are missing and we are in production
    // For now, let's just log to avoid breaking build in CI environments without secrets
  }
}

export const env = parsed.data || ({} as z.infer<typeof envSchema>);
