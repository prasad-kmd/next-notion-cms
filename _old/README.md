# Engineering Blogfolio + Workspace

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
![Static Badge](https://img.shields.io/badge/VIBE-CODE-black?style=for-the-badge&logo=v0&logoColor=white)
![Static Badge](https://img.shields.io/badge/VIBE-CODE-blue?style=for-the-badge&logo=googlegemini&logoColor=white)

## ✨ Features

- **Enhanced File-based CMS:** Seamlessly manage content using both **Markdown (.md)** and **HTML (.html)** files in `content/`.
- **Expanded Content Categories:** Support for **Articles**, **Quizzes**, **Tutorials**, **Blog Posts**, **Projects**, and a **Wiki**.
- **Interactive Quizzes:** Built-in support for interactive, multiple-choice quizzes rendered directly from content files.
- **Global Search:** Powerful client-side search with a dedicated modal and `Cmd+K` / `Ctrl+K` command palette.
- **Bookmark System:** Save your favorite posts for later, managed via local storage.
- **Dynamic Post Cards:** Visual grid layout featuring automatic image extraction and glassmorphic styling.
- **Premium UI/UX:**
  - **Redesigned Hero Section:** Modern, animated introduction with a terminal-style code block.
  - **Custom Global Scrollbar:** Branded, smooth scrolling experience across the entire site.
  - **Glassmorphic Navigation:** Collapsible sidebar and sticky navbar with integrated search, bookmarks, and sharing.
  - **Themed Layouts:** Consistent dark/light mode support with animated theme toggling.
- **Communication & Sharing:**
  - **Telegram-powered Contact Form:** Secure server-side handling of contact requests.
  - **Web Share API:** Effortless content sharing from the navbar and sidebar.
  - **Notification API:** System-level notification support for enhanced user engagement.
- **Advanced Rendering:**
  - **Syntax Highlighting:** Shiki-powered blocks with language headers and copy-to-clipboard functionality.
  - **Math Support:** LaTeX rendering via KaTeX for technical documentation.
  - **Dynamic TOC:** Sticky table of contents with scroll spying for long-form content.

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

To add new content, simply create a `.md` or `.html` file in the appropriate `content/` subdirectory (e.g., `content/blog/`, `content/quizzes/`). Both formats support YAML frontmatter:

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

For **Quizzes**, include a `quiz` block in your content (HTML or Markdown) using a base64-encoded JSON payload within a specific identifier, which the `Quiz` component will hydrate.

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
