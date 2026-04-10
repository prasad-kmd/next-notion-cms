import { getContentByType } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export async function GET() {
  const baseUrl = siteConfig.url.endsWith("/")
    ? siteConfig.url.slice(0, -1)
    : siteConfig.url;
  const blogPosts = await getContentByType("blog");
  const articlePosts = await getContentByType("articles");
  const tutorialPosts = await getContentByType("tutorials");

  const allContent = [
    ...blogPosts.map((item) => ({ ...item, type: "blog" })),
    ...articlePosts.map((item) => ({
      ...item,
      type: "articles",
    })),
    ...tutorialPosts.map((item) => ({
      ...item,
      type: "tutorials",
    })),
  ].sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  const rssItems = allContent
    .slice(0, 20)
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${baseUrl}/${item.type}/${item.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${item.type}/${item.slug}</guid>
      <pubDate>${item.date ? new Date(item.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[${item.description || ""}]]></description>
    </item>`,
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PrasadM Engineering Blogfolio</title>
    <link>${baseUrl}</link>
    <description>Documenting my journey to identify and solve engineering challenges through innovation and technical excellence.</description>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
