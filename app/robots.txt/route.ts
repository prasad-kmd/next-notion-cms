import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";

export async function GET() {
  const baseUrl = siteConfig.url.endsWith("/")
    ? siteConfig.url.slice(0, -1)
    : siteConfig.url;

  const content = `User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /sign-in/
Disallow: /external-link
Disallow: /quiz/*
Content-Signal: [ "search=yes", "ai-input=yes", "ai-train=no" ]

User-Agent: GPTBot
Disallow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
