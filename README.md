# Engineering Workspace

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-CMS-black?style=for-the-badge&logo=notion)

[![License](https://img.shields.io/github/license/prasad-kmd/next-notion-cms?style=for-the-badge)](LICENSE)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/w/prasad-kmd/next-notion-cms?style=for-the-badge&logo=github)](https://github.com/prasad-kmd/next-notion-cms/commits)
[![GitHub stars](https://img.shields.io/github/stars/prasad-kmd/next-notion-cms?style=for-the-badge&logo=github)](https://github.com/prasad-kmd/next-notion-cms/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/prasad-kmd/next-notion-cms?style=for-the-badge&logo=github)](https://github.com/prasad-kmd/next-notion-cms/network/members)
[![GitHub issues](https://img.shields.io/github/issues/prasad-kmd/next-notion-cms?style=for-the-badge&logo=github)](https://github.com/prasad-kmd/next-notion-cms/issues)

**A modern, high-performance technical documentation and engineering portfolio platform**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Demo](#-demo) • [Deploy](#-deploy-now)

</div>

---

## 📖 Table of Contents

<details>
<summary><strong>Click to expand table of contents</strong></summary>

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Notion Configuration](#notion-configuration)
- [Usage](#-usage)
  - [Development](#development)
  - [Building for Production](#building-for-production)
  - [Deployment](#deployment)
- [Project Structure](#-project-structure)
- [Content Management](#-content-management)
  - [Notion Database Schema](#notion-database-schema)
  - [Content Types](#content-types)
- [Customization](#-customization)
  - [Theme Configuration](#theme-configuration)
  - [Site Configuration](#site-configuration)
  - [Adding New Features](#adding-new-features)
- [Performance](#-performance)
- [SEO](#-seo)
- [Accessibility](#-accessibility)
- [Security](#-security)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

</details>

---

## 🌟 Overview

**Engineering Workspace** is a cutting-edge blogfolio platform designed for engineers, researchers, and developers who need a professional online presence. Built with the latest web technologies, it combines the simplicity of Notion CMS with the power of Next.js to deliver an exceptional user experience.

### What Makes It Special?

<div align="center">

| 🚀 Performance | 🎨 Design | 📝 Content |
|---------------|-----------|------------|
| Blazing fast SSR | Unique technical aesthetic | Notion-powered CMS |
| Optimized images | Dark mode native | Multiple content types |
| Minimal bundle size | Responsive layouts | Rich markdown support |

| 🔍 SEO | ♿ Accessibility | 🛡️ Security |
|--------|----------------|-------------|
| Meta tags & OG images | WCAG 2.1 AA compliant | Input validation |
| Sitemap generation | Keyboard navigation | Rate limiting ready |
| Structured data | Screen reader friendly | Secure headers |

</div>

---

## ✨ Features

### 🎯 Core Features

#### Content Management
- **📔 Notion CMS Integration**: Manage all your content directly from Notion
- **📝 Multiple Content Types**: Blog posts, articles, projects, tutorials, wiki pages
- **👥 Authors System**: Comprehensive author profiles with contribution tracking
- **🏷️ Tagging & Categories**: Organize content with flexible taxonomy
- **📅 Scheduled Publishing**: Draft and schedule content for future release

#### User Experience
- **🌓 Dark/Light Mode**: Automatic theme switching based on system preferences
- **📱 Fully Responsive**: Perfect experience on all devices
- **⌨️ Keyboard Navigation**: Full keyboard accessibility with shortcuts
- **🔍 Global Search**: Command palette (Cmd+K) for quick navigation
- **🔖 Bookmarks**: Save and organize favorite content
- **📑 Table of Contents**: Auto-generated TOC with scroll tracking

#### Technical Features
- **🎨 Premium Syntax Highlighting**: VS Code-accurate code blocks with Shiki
- **📐 LaTeX Math Support**: Beautiful math rendering with KaTeX
- **❗ GitHub Alerts**: Note, Tip, Warning, and Error callouts
- **🧩 Interactive Quizzes**: Embed quizzes directly in content
- **📊 Charts & Visualizations**: Data visualization support
- **🖼️ Open Graph Images**: Auto-generated social sharing images

### 🆕 Latest Updates

<!-- Add your changelog here -->
- **v7.0**: Redesigned hero section with technical dashboard aesthetic
- **v6.5**: Enhanced quiz system with base64 encoding
- **v6.0**: Migrated to Next.js 16 and React 19
- **v5.0**: Tailwind CSS 4 integration

---

## 🛠️ Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)
![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-1a1a1a?style=flat-square&logo=radix-ui)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-0055ff?style=flat-square&logo=framer)
![Notion API](https://img.shields.io/badge/Notion_API-Latest-000000?style=flat-square&logo=notion)
![Shiki](https://img.shields.io/badge/Shiki-Latest-fabd05?style=flat-square)
![KaTeX](https://img.shields.io/badge/KaTeX-Latest-329754?style=flat-square&logo=khan-academy)

</div>

### Full Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | React framework with SSR |
| **Language** | TypeScript 5 | Type-safe JavaScript |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **UI Components** | Radix UI | Accessible primitives |
| **Animations** | Framer Motion | Smooth animations |
| **CMS** | Notion API | Headless CMS |
| **Icons** | Lucide React | Icon library |
| **Code Highlighting** | Shiki | Syntax highlighting |
| **Math Rendering** | KaTeX | LaTeX support |
| **Markdown** | marked + rehype | Markdown processing |
| **Forms** | React Hook Form | Form handling |
| **Validation** | Zod | Schema validation |
| **Notifications** | Sonner | Toast notifications |
| **Theme** | next-themes | Dark mode |
| **Analytics** | Vercel Speed Insights | Performance monitoring |
| **Deployment** | Vercel | Hosting platform |

---

## 🚀 Quick Start

Get up and running in under 5 minutes!

### Prerequisites

Ensure you have the following installed:

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat-square&logo=node.js)
![pnpm](https://img.shields.io/badge/pnpm-8+-yellow?style=flat-square&logo=pnpm)
![Git](https://img.shields.io/badge/Git-Latest-F05032?style=flat-square&logo=git)

</div>

```bash
# Check Node.js version (v20 or higher required)
node --version

# Check pnpm (recommended package manager)
pnpm --version

# If pnpm is not installed
npm install -g pnpm
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/prasad-kmd/next-notion-cms.git
cd next-notion-cms

# 2. Install dependencies
pnpm install

# 3. Create environment file
cp .env.local.example .env.local

# 4. Create required directories
mkdir -p public/data
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# ======================================
# NOTION CMS CONFIGURATION
# ======================================

# Get your token from: https://www.notion.so/my-integrations
NOTION_AUTH_TOKEN=secret_your_notion_token_here

# Database IDs (found in Notion URL after /workspace/)
NOTION_BLOG_ID=your_blog_database_id
NOTION_ARTICLES_ID=your_articles_database_id
NOTION_TUTORIALS_ID=your_tutorials_database_id
NOTION_PROJECTS_ID=your_projects_database_id
NOTION_WIKI_ID=your_wiki_database_id
NOTION_AUTHORS_ID=your_authors_database_id

# ======================================
# SITE CONFIGURATION
# ======================================

# Production URL (update after deployment)
SITE_URL=https://your-domain.vercel.app

# ======================================
# SOCIAL MEDIA LINKS
# ======================================

NEXT_PUBLIC_GITHUB_USERNAME=your-username
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-username
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/your-username
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/your-profile
NEXT_PUBLIC_EMAIL=your@email.com
NEXT_PUBLIC_GITHUB_SPONSORS_URL=https://github.com/sponsors/your-username

# ======================================
# OPTIONAL: GITHUB INTEGRATION
# ======================================

# Increases rate limit (get from: https://github.com/settings/tokens)
GITHUB_TOKEN=your_github_token

# ======================================
# OPTIONAL: CONTACT FORM (Telegram)
# ======================================

TELEGRAM_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# ======================================
# OPTIONAL: PUSH NOTIFICATIONS
# ======================================

NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_key
```

### Notion Configuration

Follow our detailed [Notion Setup Guide](Notion-Instruction.md) for step-by-step instructions.

**Quick Setup:**

1. **Create Integration**: Visit [Notion Integrations](https://www.notion.so/my-integrations)
2. **Create Databases**: Set up databases for Blog, Articles, Projects, Tutorials, Wiki, and Authors
3. **Share Databases**: Connect each database to your integration
4. **Copy IDs**: Extract database IDs from URLs
5. **Add Properties**: Follow the schema in [Notion-Instruction.md](Notion-Instruction.md)

---

## 💻 Usage

### Development

Start the development server with hot-reloading:

```bash
pnpm dev
```

The site will be available at `http://localhost:3000`

**Available Scripts:**

```bash
# Development
pnpm dev              # Start dev server (port 3000)
pnpm dev:https        # Start with HTTPS

# Building
pnpm build            # Create production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix lint errors automatically
pnpm type-check       # Run TypeScript compiler

# Testing (when configured)
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm test:coverage    # Generate coverage report
```

### Building for Production

```bash
# Create optimized production build
pnpm build

# Preview production build locally
pnpm start
```

### Deployment

#### Deploy to Vercel (Recommended)

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/prasad-kmd/next-notion-cms)

</div>

**Steps:**

1. Click "Deploy with Vercel" button above
2. Connect your GitHub repository
3. Add environment variables from `.env.local.example`
4. Deploy!

**Manual Deployment:**

```bash
# 1. Install Vercel CLI
pnpm add -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Deploy to production
vercel --prod
```

#### Other Deployment Options

<details>
<summary><strong>Docker Deployment</strong></summary>

```bash
# Build Docker image
docker build -t engineering-workspace .

# Run container
docker run -p 3000:3000 \
  -e NOTION_AUTH_TOKEN=xxx \
  -e NOTION_BLOG_ID=xxx \
  engineering-workspace
```

</details>

<details>
<summary><strong>Netlify Deployment</strong></summary>

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

</details>

---

## 📁 Project Structure

```
next-notion-cms/
├── 📂 app/                      # Next.js App Router
│   ├── 📂 api/                  # API Routes
│   │   ├── author/              # Author data endpoint
│   │   ├── og/                  # OG image generation
│   │   ├── search/              # Search functionality
│   │   └── secrets/             # ⚠️ To be removed (security)
│   ├── 📂 blog/                 # Blog pages
│   ├── 📂 articles/             # Articles pages
│   ├── 📂 projects/             # Projects showcase
│   ├── 📂 tutorials/            # Tutorial content
│   ├── 📂 wiki/                 # Knowledge base
│   ├── 📂 authors/              # Author profiles
│   ├── 📂 contact/              # Contact form
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
│
├── 📂 components/               # React Components
│   ├── 📂 ui/                   # Base UI (Radix)
│   ├── 📂 quiz-library/         # Quiz components
│   ├── navigation.tsx           # Main nav
│   ├── footer.tsx               # Footer
│   └── [more components...]
│
├── 📂 lib/                      # Core Logic
│   ├── config.ts                # Site config
│   ├── content.ts               # Content fetching
│   ├── notion.ts                # Notion client
│   ├── github.ts                # GitHub API
│   └── utils.ts                 # Utilities
│
├── 📂 hooks/                    # Custom Hooks
│   ├── use-bookmarks.tsx        # Bookmark logic
│   ├── use-debounce.ts          # Debounce hook
│   └── [more hooks...]
│
├── 📂 types/                    # TypeScript Types
│   ├── changelog.ts             # Changelog types
│   └── github.ts                # GitHub types
│
├── 📂 content/                  # Fallback Content
│   ├── blog/                    # Markdown files
│   ├── articles/
│   └── [more content...]
│
├── 📂 public/                   # Static Assets
│   ├── fonts/                   # Custom fonts
│   ├── img/                     # Images
│   ├── data/                    # JSON data
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
│
└── 📄 Configuration Files
    ├── package.json             # Dependencies
    ├── tsconfig.json            # TypeScript config
    ├── tailwind.config.js       # Tailwind config
    ├── next.config.mjs          # Next.js config
    └── eslint.config.mjs        # ESLint config
```

---

## 📝 Content Management

### Notion Database Schema

Each content database should have these properties:

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| **Name** | Title | Content title | ✅ |
| **Slug** | Text | URL slug | ✅ |
| **Authors** | Relation | Link to Authors DB | ✅ |
| **Date** | Date | Publication date | ✅ |
| **Status** | Select | Published/Draft | ✅ |
| **Description** | Text | Summary | ✅ |
| **Tags** | Multi-select | Keywords | ❌ |
| **Categories** | Select | Category | ❌ |
| **AIAssisted** | Checkbox | AI indicator | ❌ |
| **Technical** | Multi-select | Tech stack | ❌ |

### Content Types

#### 📖 Blog Posts
Personal updates, thoughts, and quick shares

#### 📄 Articles  
In-depth technical deep-dives and tutorials

#### 🛠️ Projects
Showcase of your work with demos and code

#### 📚 Tutorials
Step-by-step guides and how-tos

#### 📜 Wiki
Persistent knowledge and documentation

#### 👤 Authors
Team member profiles and bios

### Rich Content Features

**Code Blocks:**
````markdown
```typescript
// Syntax highlighted with Shiki
const greeting = "Hello, World!";
console.log(greeting);
```
````

**Math Equations:**
```markdown
Inline: $E = mc^2$

Block:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
```

**Interactive Quizzes:**
```markdown
[quiz]
{
  "questions": [
    {
      "question": "What does JSX stand for?",
      "options": ["JavaScript XML", "Java Standard Extension", "JSON Syntax"],
      "answer": 0
    }
  ]
}
[/quiz]
```

**GitHub-Style Alerts:**
```markdown
> [!NOTE]
> Useful information

> [!TIP]
> Helpful advice

> [!WARNING]
> Important caution

> [!ERROR]
> Critical issue
```

---

## 🎨 Customization

### Theme Configuration

Edit `app/globals.css` to customize colors:

```css
:root {
  /* Primary brand color */
  --primary: hsl(181 100% 28%);
  
  /* Background colors */
  --background: hsl(216 100% 98%);
  --card: hsl(0 0% 100%);
  
  /* Text colors */
  --foreground: hsl(220 27% 4%);
  --muted-foreground: hsl(220 5% 34%);
  
  /* Add more custom colors... */
}
```

### Site Configuration

Edit `lib/config.ts`:

```typescript
export const siteConfig = {
  title: "Your Name | Engineering Blogfolio",
  description: "Your unique description",
  author: "Your Name",
  url: "https://your-domain.com",
  // ... more settings
};
```

### Adding New Features

See [AGENTS.md](AGENTS.md) and [DESIGN.md](DESIGN.md) for detailed development guidelines.

---

## ⚡ Performance

### Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| LCP | < 2.5s | ✅ |
| FID | < 100ms | ✅ |
| CLS | < 0.1 | ✅ |
| TTFB | < 600ms | ✅ |

### Optimization Features

- ✅ Server-Side Rendering (SSR)
- ✅ Incremental Static Regeneration (ISR)
- ✅ Image optimization with Next.js
- ✅ Font optimization with local hosting
- ✅ Code splitting and tree shaking
- ✅ Efficient caching strategies

### Performance Tips

1. **Optimize Images**: Use WebP/AVIF formats
2. **Lazy Load**: Defer non-critical components
3. **Minimize Client JS**: Prefer Server Components
4. **Use Edge Functions**: For global performance

---

## 🔍 SEO

Built-in SEO features:

- ✅ Dynamic meta tags
- ✅ Open Graph images
- ✅ Twitter Cards
- ✅ XML Sitemap
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ Structured Data (JSON-LD)
- ✅ RSS Feed

### Social Media Preview

Your content will look great when shared:

<div align="center">

![OG Image Example](https://placehold.co/1280x720/008B8B/FFFFFF?text=Your+Content+Title)

*Auto-generated Open Graph image*

</div>

---

## ♿ Accessibility

Committed to inclusive design:

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ ARIA labels
- ✅ Color contrast standards
- ✅ Skip links
- ✅ Reduced motion support

---

## 🔒 Security

Security best practices:

- ✅ Environment variable protection
- ✅ Input validation
- ✅ XSS prevention
- ✅ CSRF protection ready
- ✅ Security headers
- ✅ Rate limiting ready
- ✅ Dependency auditing

### Security Checklist

- [ ] Remove `/api/secrets` endpoint (critical!)
- [ ] Convert forms to Server Actions
- [ ] Enable rate limiting
- [ ] Configure CSP headers
- [ ] Regular `pnpm audit`

See [SECURITY.md](SECURITY.md) and [improvement-suggestions.md](improvement-suggestions.md) for details.

---

## 🧪 Testing

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

### Test Coverage Goals

- Components: > 80%
- Utilities: > 90%
- Pages: > 70%

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) (coming soon).

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Code Style

We use:
- ESLint for code quality
- Prettier for formatting
- Conventional Commits for commit messages

---

## 📞 Support

### Getting Help

- 📖 [Documentation](#-documentation)
- 🐛 [Issue Tracker](https://github.com/prasad-kmd/next-notion-cms/issues)
- 💬 [Discussions](https://github.com/prasad-kmd/next-notion-cms/discussions)
- 📧 Email: [contact@prasadm.vercel.app](mailto:contact@prasadm.vercel.app)
- 🐦 Twitter: [@prasadmadhuran1](https://twitter.com/prasadmadhuran1)

### Sponsor This Project

If you find this project useful, consider supporting:

<div align="center">

[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor_on_GitHub-EA4AAA?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/prasad-kmd)

</div>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 PrasadM

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

<div align="center">

### Made with ❤️ by [PrasadM](https://github.com/prasad-kmd)

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/prasad-kmd)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/prasadmadhuran1)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/prasad-madhuranga)

**Star ⭐ this repo if you find it helpful!**

</div>
