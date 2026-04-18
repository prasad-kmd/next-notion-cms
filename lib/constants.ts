import { siteConfig } from "./config";

export const contentConfig = {
  wordsPerMinute: 220,
  cacheRevalidation: 3600, // 1 hour
  maxFileSize: 20 * 1024 * 1024, // 20 MB
  allowedFileTypes: ['pdf', 'jpg', 'png', 'jpeg'],
};

export const securityConfig = {
  rateLimitRequests: 3,
  rateLimitWindowMs: 60 * 1000, // 1 minute
};

export const notionConfig = {
  revalidate: 3600,
  defaultTags: ["global-content"],
};
