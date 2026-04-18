# Design Documentation

## Overview
The Engineering Workspace Template is a high-performance, mechatronics-focused technical documentation and portfolio platform. It is built using Next.js 16, Tailwind CSS 4, and TypeScript, with Notion serving as a powerful headless CMS.

## Architecture

### 1. Frontend Framework
- **Next.js 16 (App Router):** Leverages Server Components for optimal performance and SEO.
- **Tailwind CSS 4:** Utilizes the latest CSS features for styling, including the `oklch` color space.
- **Framer Motion & GSAP:** Powers smooth, high-fidelity animations throughout the UI.

### 2. Content Management (CMS)
- **Notion Integration:** Uses `@notionhq/client` and `notion-to-md` to fetch and convert Notion pages into Markdown.
- **File-based Fallback:** Supports local Markdown and HTML files with frontmatter for offline development and local content management.
- **Unified Rendering Pipeline:** Both Notion and local content pass through a unified processing pipeline that handles:
    - Syntax highlighting (Shiki)
    - Math equations (KaTeX)
    - Interactive quizzes
    - GitHub-style alerts
    - Table of Contents (TOC) generation

### 3. Key Components
- **ContentRenderer:** A versatile component that handles the complex task of rendering processed HTML, including lazy loading images and injecting interactive elements.
- **FeaturedHero:** A high-performance dashboard-style hero section with a geometric grid and GSAP transitions.
- **Unique Card System:** Distinct visual identities for different content types (Journal for Blog, Technical Publication for Articles, Blueprint for Projects).
- **Search System:** Real-time search that combines a local content index with native Notion search capabilities.

### 4. Performance Optimizations
- **Image Optimization:** Uses `next/image` with LQIP (Low-Quality Image Placeholders), blur-up effects, and lazy loading.
- **Caching:** Utilizes Next.js `unstable_cache` and React `cache` to minimize Notion API calls and speed up page loads.
- **Static Site Generation (SSG):** Dynamic routes are pre-rendered using `generateStaticParams`.

## Design Principles
1. **Technical Aesthetics:** Dark-themed, glassmorphic UI with a focus on typography (Google Sans) and technical details.
2. **Content First:** Minimalist but feature-rich layouts that prioritize readability and information density.
3. **Interactivity:** Engaging elements like quizzes, copyable code blocks, and smooth transitions to keep users focused.
4. **Developer Experience:** Easy customization via `lib/config.ts` and clear separation of concerns.
