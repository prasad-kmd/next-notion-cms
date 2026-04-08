# Next Notion CMS

A modern, high-performance engineering blogfolio and workspace built with **Next.js 16**, **Tailwind CSS 4**, and **TypeScript**. Designed for developers who want a polished personal platform with a file-based CMS and interactive tools.

<!-- ![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript) -->

---
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![GitHub License](https://img.shields.io/github/license/prasad-kmd/next-notion-cms?style=for-the-badge)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/prasad-kmd/next-notion-cms?style=for-the-badge&logo=github&logoColor=black)
![GitHub contributors](https://img.shields.io/github/contributors/prasad-kmd/next-notion-cms?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/prasad-kmd/next-notion-cms?display_timestamp=committer&style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/prasad-kmd/next-notion-cms?style=for-the-badge)
---
![Static Badge](https://img.shields.io/badge/VIBE-CODE-purple?style=for-the-badge&logo=googlejules&logoColor=white)
![Static Badge](https://img.shields.io/badge/VIBE-CODE-blue?style=for-the-badge&logo=googlegemini&logoColor=white)

## ✨ Features

- **File-based CMS:** Manage content using simple Markdown files in `content/`.
- **Engineering Blog:** Full-featured blog with categories, tags, and reading time estimation.
- **Project Showcase:** Elegant cards and detail pages for technical projects.
- **Technical Wiki:** A digital garden for documentation and knowledge sharing.
- **Author Pages:** Dedicated profile pages for contributors with bios, social links, and a contribution history.
- **Advanced MDX Rendering:**
  - **Syntax Highlighting:** Powered by Shiki with VS Code-quality themes.
  - **Math Support:** LaTeX rendering via KaTeX.
  - **Table of Contents:** Auto-generated TOC with active state tracking.
- **Premium UI/UX:**
  - Custom **Google Sans** typography as default.
  - Right-aligned sticky sidebar for content detail pages.
  - Responsive, glassmorphic layout.
- **Workspace UI:**
  - Glassmorphic design with a persistent, collapsible sidebar.
  - Floating navbar with dark/light mode toggle.
  - Smooth animations using Framer Motion.
- **Optimized for Performance:** Server components, static generation, and minimal client JS.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd next-notion-cms
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```text
├── app/              # Next.js App Router (Routes & Pages)
├── components/       # Reusable UI components
├── content/          # Markdown files (Blog, Projects, Wiki, Authors)
├── lib/              # Content loader, utilities, and CMS logic
├── public/           # Static assets (Fonts, Images)
└── types/            # Shared TypeScript definitions
```

## 📝 Content Management

To add new content, simply create a `.md` file in the appropriate `content/` subdirectory. Use the following frontmatter:

```markdown
---
title: "My Awesome Post"
slug: "my-awesome-post"
date: "2025-05-15"
status: "Published"
description: "A brief summary for the card view."
tags: ["Next.js", "React"]
category: "Engineering"
technical: "Next.js 16, Tailwind 4"
author: "author-slug"
aiAssisted: false
final: true
---
```

### Authors

Authors are managed in `content/authors/`. Create a `.md` file (e.g., `masum.md`) with the following structure:

```markdown
---
name: "Author Name"
role: "Role Description"
bio: "A short professional biography."
avatar: "URL or path to avatar image"
twitter: "username"
github: "username"
linkedin: "username"
---
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Content:** gray-matter, unified, remark, rehype
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Theme:** next-themes

---

Built with ❤️ by PrasadM.
