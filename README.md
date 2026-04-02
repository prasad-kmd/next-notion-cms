# Engineering Blogfolio

A modern, high-performance engineering blogfolio and workspace website built with Next.js, TypeScript, and Tailwind CSS 4.

![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

## Features

- **🚀 Performance-First**: Built on Next.js 16 with Server Components and static generation.
- **📚 File-based CMS**: Manage content simply via `.md` files with comprehensive frontmatter.
- **🌗 Elegant Dark Mode**: Default dark mode with glassmorphic UI effects and custom themes.
- **📝 Rich Content Sections**:
  - **Blog**: Long-form articles and technical insights.
  - **Projects**: Showcase of engineering work and tools.
  - **Wiki / Notes**: Fast-access technical reference and snippets.
- **🖋️ Enhanced Markdown**:
  - Code syntax highlighting with **Shiki**.
  - Mathematical equations via **KaTeX**.
  - Automatic Table of Contents for deep dives.
  - Dynamic SEO metadata for every page.
- **✨ Polished UX**: Smooth animations with **Framer Motion** and responsive mobile-first design.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Content**: gray-matter, remark, rehype
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theming**: Next Themes

## Getting Started

### Prerequisites

- Node.js (Latest LTS)
- PNPM (Recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

### Adding Content

Content is stored in the `content/` directory. Create a new `.md` file in the appropriate subfolder (`blog/`, `projects/`, or `wiki/`) with the following frontmatter:

```markdown
---
title: "My Awesome Post"
slug: "my-awesome-post"
date: "2024-05-20"
status: "Published"
description: "A brief summary of the post."
tags: ["Next.js", "React"]
category: "Engineering"
technical: "Next.js, TypeScript"
aiAssisted: false
---
Your content here...
```

## License

This project is licensed under the MIT License.
