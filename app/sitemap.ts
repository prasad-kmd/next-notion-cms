import { MetadataRoute } from "next";
import { getContentByType } from "@/lib/content";

import { siteConfig } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.endsWith("/")
    ? siteConfig.url.slice(0, -1)
    : siteConfig.url;

  const types = ["blog", "articles", "projects", "tutorials", "wiki"] as const;
  const contentRoutesPromise = types.map(async (type) => {
    const items = await getContentByType(type);
    return items.map((item) => ({
      url: `${baseUrl}/${type}/${item.slug}`,
      lastModified: item.date ? new Date(item.date) : new Date(),
      changeFrequency: "weekly" as const,
      priority: type === "blog" || type === "articles" ? 0.8 : 0.6,
    }));
  });

  const contentRoutes = (await Promise.all(contentRoutesPromise)).flat();

  // Define tools slugs manually or dynamically if possible
  const toolsSlugs = [
    "555-timer-calculator", "battery-life-estimator", "beam-deflection-calculator",
    "bolt-torque-chart", "color-contrast-checker", "compressor", "css-unit-converter",
    "curve-fitter", "data-transform", "diff-checker", "gear-ratio-calculator",
    "html-encoder", "iso-fits-tolerances", "json-formatter", "latex-equation-editor",
    "latex-mathml-converter", "led-resistor-calculator", "markdown-editor",
    "material-database", "matrix-calculator", "moment-of-inertia-calculator",
    "op-amp-gain-calculator", "pcb-impedance-calculator", "pcb-trace-width",
    "pid-controller-simulator", "pid-tuner", "pwm-voltage-converter", "regex-architect",
    "resistor-color-code", "resume-creator", "scientific-calculator",
    "sensor-scaling-calculator", "stepper-motor-calculator", "student-guide-navigator",
    "unit-circle", "unit-converter", "user-persona-creator", "voltage-divider-designer"
  ];

  const toolsRoutes = toolsSlugs.map(slug => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

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
    "/authors",
    "/roadmap",
    "/uses",
    "/now",
    "/search",
    "/tools",
    "/changelog",
    "/cheat-sheets",
    "/disclaimer",
    "/glossary",
    "/privacy-policy",
    "/reading-list",
    "/resources",
    "/security",
    "/snippets",
    "/sponsorship",
    "/style-guide",
    "/team",
    "/terms-and-conditions",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes, ...contentRoutes, ...toolsRoutes];
}
