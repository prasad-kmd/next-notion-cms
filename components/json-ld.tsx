import { siteConfig } from "@/lib/config";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function getBaseSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.title,
    "url": siteConfig.url,
    "description": siteConfig.description,
    "author": {
      "@type": "Person",
      "name": siteConfig.author,
      "url": siteConfig.url
    }
  };
}

export function getBreadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `${siteConfig.url}${item.href}`
    }))
  };
}

export function getContentSchema(post: unknown, type: string) {
  const schemaType = type === "articles" ? "TechArticle" : "BlogPosting";
  
  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "headline": post.title,
    "description": post.description,
    "image": post.firstImage || `${siteConfig.url}/api/og?title=${encodeURIComponent(post.title)}`,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.authorName || siteConfig.author,
      "url": `${siteConfig.url}/authors/${post.author}`
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.title,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/favicon.ico`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/${type}/${post.slug}`
    }
  };
}
