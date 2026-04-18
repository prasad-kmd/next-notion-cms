import { MetadataRoute } from "next";
import { getContentByType } from "@/lib/content";

import { siteConfig } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.endsWith("/")
    ? siteConfig.url.slice(0, -1)
    : siteConfig.url;

  const types = ["blog", "articles", "projects", "tutorials"] as const;
  const contentRoutesPromise = types.map(async (type) => {
    const items = await getContentByType(type);
    return items.map((item) => ({
      url: `${baseUrl}/${type}/${item.slug}`,
      lastModified: item.date ? new Date(item.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  });

  const contentRoutes = (await Promise.all(contentRoutesPromise)).flat();

  const staticRoutes = [
    "",
    "/about",
    "/portfolio",
    "/blog",
    "/articles",
    "/projects",
    "/tutorials",
    "/gallery",
    "/contact",
    "/pages",
    "/game-deal",
    "/feeds",
    "/researches",
    "/open-books",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes, ...contentRoutes];
}
