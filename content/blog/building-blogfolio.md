---
title: "Building an Engineering Blogfolio with Next.js"
slug: "building-blogfolio"
date: "2024-05-20"
status: "Published"
description: "A deep dive into the architecture and design of this blogfolio, featuring Next.js 16 and Tailwind CSS 4."
tags: ["Next.js", "React", "TypeScript", "Tailwind"]
category: "Engineering"
final: true
aiAssisted: true
technical: "Next.js, MDX, KaTeX, Tailwind CSS"
---

Welcome to the inaugural post of this engineering blogfolio. In this article, we'll explore the technical decisions behind building a modern, high-performance personal platform.

## Why Next.js?

Next.js provides an excellent foundation for a blogfolio due to its:
- **Server Components**: Minimal client-side JS.
- **Static Site Generation (SSG)**: Lightning fast page loads.
- **Image Optimization**: Automatic handling of various formats and sizes.

### Code Example

Here is how we load our markdown content:

```typescript
export async function getPostBySlug(type: 'blog' | 'projects' | 'wiki', slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(contentDirectory, type, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return { ...data, slug: realSlug, content };
}
```

## Mathematical Support

We support mathematical equations using KaTeX. For example, the quadratic formula is:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

And inline math: $E = mc^2$.

## Conclusion

This platform is designed to be a living document of my engineering journey.
