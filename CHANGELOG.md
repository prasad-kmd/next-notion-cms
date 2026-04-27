# Changelog

All notable changes to this project will be documented in this file.

## [1.8.0] - 2025-06-05

### Added

- **Print-to-PDF Export**: Implemented professional PDF export functionality for all content pages.
  - **A4 Layout**: Optimized print styles with 25mm/20mm margins and black-on-white theme overrides.
  - **Dynamic Headers/Footers**: Includes post title, author name, publication date, and page numbers.
  - **Academic-Grade Formatting**: Professional typography (11pt body), formatted code blocks, and link URL preservation.
  - **Sonner Notifications**: Interactive toast notifications for preparation, success, and cancellation states.
  - **Client-Side Only**: Efficient browser-native printing without server dependencies.

## [1.7.0] - 2025-05-29

### Added

- **Automated Disposable Email Detection**: Replaced manual `tempmail.json` with `fakeout` npm package for automated, up-to-date disposable email blocking on the contact form.
- **Profanity Filtering**: Integrated `obscenity` npm package for automated profanity detection on both contact form and comments.
- **Visual Word Highlighting**: New `HighlightedTextArea` component that visually marks blocked words after a failed validation attempt.
- **Sonner Validation Notifications**: Enhanced user feedback with specific, timed toast notifications for disposable email and profanity errors.
- **Unified Validation Pipeline**: Centralized validation logic in `lib/validation/validate.ts` for consistent form handling.

### Removed

- **Legacy Temp-Mail Data**: Deleted `public/data/tempmail.json` and associated manual lookup logic.
- **Basic Profanity Filter**: Removed the static `BLACKLIST` approach in `lib/comments.ts` in favor of the more robust `obscenity` matcher.

## [1.6.0] - 2025-05-22

### Added

- **Custom Accessibility Controller:** Implemented a scoped controller for content areas allowing users to adjust font size, family, line height, and spacing.
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
