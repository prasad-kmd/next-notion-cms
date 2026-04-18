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
  - **Premium Shiki Highlighting:** VS Code-accurate syntax highlighting using Shiki themes (One Dark Pro) with a custom Mac-style window UI.
  - **LaTeX Support:** Full math notation rendering via KaTeX ($...$ and $$...$$).
  - **Interactive Quizzes:** Dynamic, base64-encoded quiz components injectable directly into content.
  - **GitHub-style Alerts:** Support for `[!NOTE]`, `[!TIP]`, `[!WARNING]`, etc.
- **🛡️ Enterprise-Grade Utilities:**
  - **Spam Protection:** Integrated temp-mail domain blocker for the contact form via `public/data/tempmail.json`.
  - **Smart TOC:** Automatically generated Table of Contents with active-state scroll tracking.
  - **Search & Command Palette:** Global `Cmd+K` search modal for quick navigation.

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

Create a `.env.local` file in the root directory and add your Notion credentials:

```env
NOTION_AUTH_TOKEN=your_notion_auth_token
NOTION_BLOG_ID=your_blog_database_id
NOTION_ARTICLES_ID=your_articles_database_id
NOTION_TUTORIALS_ID=your_tutorials_database_id
NOTION_PROJECTS_ID=your_projects_database_id
NOTION_WIKI_ID=your_wiki_database_id
NOTION_AUTHORS_ID=your_authors_database_id
```

### 5. Development Mode

Start the development server with hot-reloading:

```bash
pnpm dev
```
The site will be available at `http://localhost:3000`.

### 6. Production Build

To build the application for production:

```bash
pnpm build
pnpm start
```

## 📂 Project Structure

```text
├── app/              # Next.js App Router (Routes & Pages)
├── components/       # Reusable UI components
├── content/          # Fallback Markdown/HTML files
├── lib/              # Notion client, content loader, and CMS logic
├── public/           # Static assets (Fonts, Images, Blacklists)
└── types/            # Shared TypeScript definitions
```

## 📝 Content Management

Content is primarily managed via Notion. If Notion environment variables are not provided, the system falls back to the local `content/` directory.

### Notion Database Schema

Each content database should have the following properties:
- **Name/Title**: Title of the item
- **Slug**: URL slug
- **Authors**: Relation to Authors database
- **Date**: Publication date
- **Status**: Select [Published, Draft]
- **Description**: Summary for cards
- **Tags**: Multi-select
- **Categories**: Select
- **AIAssisted**: Checkbox
- **Technical**: Multi-Select

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **CMS:** Notion API
- **Styling:** Tailwind CSS 4
- **Syntax Highlighting:** Shiki
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Theme:** next-themes

---

Built with ❤️ by PrasadM.
