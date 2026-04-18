# Engineering Workspace

A modern, high-performance technical documentation and engineering portfolio platform built with **Next.js 16**, **Tailwind CSS 4**, and **TypeScript**. Optimized for mechatronics research, digital architecture, and high-fidelity documentation.

---
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-CMS-black?style=for-the-badge&logo=notion)
![GitHub License](https://img.shields.io/github/license/prasad-kmd/next-notion-cms?style=for-the-badge)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/prasad-kmd/next-notion-cms?style=for-the-badge&logo=github&logoColor=black)
![GitHub deployments](https://img.shields.io/github/deployments/prasad-kmd/next-notion-cms/Production?logo=Vercel&style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)
![pnpm](https://img.shields.io/badge/pnpm-Recommended-orange?style=for-the-badge&logo=pnpm)
![GitHub stars](https://img.shields.io/github/stars/prasad-kmd/next-notion-cms?style=for-the-badge&logo=github)
![GitHub forks](https://img.shields.io/github/forks/prasad-kmd/next-notion-cms?style=for-the-badge&logo=github)
![GitHub issues](https://img.shields.io/github/issues/prasad-kmd/next-notion-cms?style=for-the-badge&logo=github)
![GitHub pull requests](https://img.shields.io/github/issues-pr/prasad-kmd/next-notion-cms?style=for-the-badge&logo=github)

---

## ✨ Features

- **🚀 Performance-First Architecture:** Built with **Next.js 16** (App Router) for lightning-fast server-side rendering and minimal client-side hydration.
- **📔 Notion CMS Integration:** Fully integrated with Notion as a headless CMS. Manage your blog, articles, projects, tutorials, and wiki directly from Notion.
- **🎨 Unique Design Identity:** 
  - **Redesigned Hero (v7):** A technical "Engineering Excellence" dashboard with a timed carousel of latest works, code-focused aesthetics, and geometric grid systems.
  - **Specialized Cards:** Distinct visual identities for **Blog**, **Articles**, and **Projects** to distinguish different content types.
  - **Technical Wiki:** A structured digital garden for persistent knowledge and documentation.
- **✍️ Authors System:** A comprehensive directory of contributors with high-fidelity "Dossier" profile pages, contribution metrics, and social integration.
- **🛠️ Advanced Technical Pipeline:**
  - **Premium Shiki Highlighting:** VS Code-accurate syntax highlighting using Shiki themes (One Dark Pro) with a custom Mac-style window UI. Lazy-loaded languages for better performance.
  - **LaTeX Support:** Full math notation rendering via KaTeX ($...$ and $$...$$).
  - **Interactive Quizzes:** Dynamic, base64-encoded quiz components injectable directly into content.
  - **GitHub-style Alerts:** Support for `[!NOTE]`, `[!TIP]`, `[!WARNING]`, etc.
- **🛡️ Enterprise-Grade Utilities:**
  - **Secure Contact Form:** Server Actions-based submission with Zod validation, rate limiting, and Telegram integration.
  - **Spam Protection:** Integrated temp-mail domain blocker for the contact form.
  - **Smart TOC:** Automatically generated Table of Contents with active-state scroll tracking.
  - **Search & Command Palette:** Global `Cmd+K` search modal for quick navigation.
- **⚡ Optimizations & SEO:**
  - **Image Excellence:** Next.js optimized images with LQIP, blur-up effects, and native lazy loading.
  - **Dynamic Sitemap:** Recursively generated sitemap including all content types and authors.
  - **Semantic SEO:** Full Schema.org (JSON-LD) integration for articles, blog posts, and breadcrumbs.

## 🏗️ Architecture

```mermaid
graph TD
    A[Next.js App] --> B[Notion CMS]
    A --> C[Local Markdown]
    A --> D[Vercel Edge Network]
    B --> E[Notion API]
    C --> F[File System]
    A --> G[Telegram API (Server-side)]
```

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js**: v20.x or higher
- **Package Manager**: `pnpm` (highly recommended)

### 2. Notion Setup

1. Create a Notion Integration at [Notion - My Integrations](https://www.notion.so/my-integrations).
2. Create databases for **Blog**, **Articles**, **Tutorials**, **Projects**, **Wiki**, and **Authors**.
3. Share each database with your integration.
4. Copy the Database IDs and your Internal Integration Token.

Refer to `Notion-Instruction.md` for the detailed database schema and setup steps.

### 3. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/prasad-kmd/next-notion-cms.git

# Navigate to the project directory
cd next-notion-cms

# Install dependencies
pnpm install

# Create local data directory if missing
mkdir -p public/data
```

### 4. Environment Variables

Create a `.env.local` file in the root directory and add your credentials:

```env
# Notion
NOTION_AUTH_TOKEN=your_notion_auth_token
NOTION_BLOG_ID=...
NOTION_ARTICLES_ID=...
NOTION_TUTORIALS_ID=...
NOTION_PROJECTS_ID=...
NOTION_WIKI_ID=...
NOTION_AUTHORS_ID=...

# Telegram (Optional for Contact Form)
TELEGRAM_TOKEN=...
TELEGRAM_CHAT_ID=...

# GitHub (Optional for Repositories)
NEXT_PUBLIC_GITHUB_TOKEN=...
NEXT_PUBLIC_GITHUB_USERNAME=...
```

### 5. Development Mode

Start the development server:

```bash
pnpm dev
```
The site will be available at `http://localhost:3000`.

## 📂 Project Structure

```text
├── app/              # Next.js App Router (Routes, Actions, API)
├── components/       # Reusable UI components
├── content/          # Fallback Markdown/HTML files
├── lib/              
│   ├── content/      # Content processing & transformers
│   ├── notion.ts     # Notion API client
│   ├── env.ts        # Environment variable validation
│   └── config.ts     # Site configuration
├── public/           # Static assets
└── types/            # Shared TypeScript definitions
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **CMS:** Notion API
- **Styling:** Tailwind CSS 4
- **Syntax Highlighting:** Shiki (Lazy-loaded)
- **Animations:** Framer Motion + GSAP
- **Validation:** Zod

## 🛡️ Security

- **Server-side only** processing of sensitive API keys (Telegram, Notion).
- **Zod-validated** environment variables and form inputs.
- **Content Security Policy (CSP)** and security headers enabled.
- **Rate limiting** on contact form submissions.

## 📄 Documentation

- [Design Documentation](DESIGN.md)
- [Future Implementation Plan](future-implementation.md)
- [Changelog](CHANGELOG.md)

---

Built with ❤️ by PrasadM.
