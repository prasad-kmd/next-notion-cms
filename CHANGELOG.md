# Changelog

All notable changes to this project will be documented in this file.

## [1.6.0] - 2025-05-22

### Added
- **Breadcrumbs:** Added navigation breadcrumbs to all content detail pages for better UX.
- **Native Notion Search:** Integrated real-time search using the Notion API, augmenting the local content index.
- **Schema.org Markup:** Implemented JSON-LD structured data for BlogPosting, TechArticle, and BreadcrumbList to improve SEO.
- **Image Optimizations:**
    - LQIP (Low-Quality Image Placeholders) using SVG shimmers.
    - Native lazy loading for all images within content.
    - Blur-up effect for content cards.
- **New Documentation:**
    - `DESIGN.md`: Detailed architecture and design documentation.
    - `future-implementation.md`: Roadmap for future features.

### Changed
- **Sitemap:** Enhanced `sitemap.ts` to include all content types (including Wiki and Authors) and optimized crawl priorities.
- **Content Cards:** Updated `unique-cards.tsx` to utilize Next.js Image optimization features.

## [1.5.0] - 2025-05-15
- Initial public release of the Notion CMS integration.
- High-fidelity engineering dashboard hero.
- Multi-type content support (Blog, Articles, Projects, Tutorials, Wiki).
