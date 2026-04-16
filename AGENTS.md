# AI Agents Documentation

Comprehensive guide for AI agents working with this Engineering Workspace codebase.

---

## Table of Contents

- [Overview](#overview)
- [Codebase Structure](#codebase-structure)
- [Development Guidelines](#development-guidelines)
- [Component Patterns](#component-patterns)
- [API Integration](#api-integration)
- [Content Management](#content-management)
- [Testing Strategy](#testing-strategy)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## Overview

This is a **Next.js 16** engineering blogfolio platform with **Notion CMS** integration, built with modern React patterns and optimized for performance and accessibility.

### Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | Framework (App Router) |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| Notion API | Latest | CMS |
| Radix UI | Latest | UI Primitives |
| Framer Motion | Latest | Animations |
| Shiki | Latest | Syntax Highlighting |

### Project Goals

1. **Performance**: Fast loading, optimized rendering
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Maintainability**: Clean, documented code
4. **Scalability**: Easy to extend with new features
5. **SEO**: Optimized for search engines

---

## Codebase Structure

```
/workspace/
├── app/                      # Next.js App Router (Pages & Routes)
│   ├── api/                  # API Routes
│   │   ├── author/           # Author data endpoint
│   │   ├── og/               # Open Graph image generation
│   │   ├── search/           # Search functionality
│   │   └── secrets/          # ⚠️ Security issue - needs removal
│   ├── blog/                 # Blog listing & posts
│   ├── articles/             # Articles section
│   ├── projects/             # Projects showcase
│   ├── tutorials/            # Tutorial content
│   ├── wiki/                 # Knowledge base
│   ├── authors/              # Author profiles
│   ├── contact/              # Contact form
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
│
├── components/               # Reusable Components
│   ├── ui/                   # Base UI components (Radix)
│   ├── quiz-library/         # Quiz components
│   ├── navigation.tsx        # Main navigation
│   ├── footer.tsx            # Site footer
│   ├── search.tsx            # Search modal
│   ├── toc.tsx               # Table of contents
│   └── [other components]
│
├── lib/                      # Core Logic & Utilities
│   ├── config.ts             # Site configuration
│   ├── content.ts            # Content fetching logic
│   ├── notion.ts             # Notion API client
│   ├── github.ts             # GitHub API integration
│   ├── utils.ts              # Utility functions
│   └── animations.ts         # Animation configurations
│
├── hooks/                    # Custom React Hooks
│   ├── use-bookmarks.tsx     # Bookmark management
│   ├── use-debounce.ts       # Debounce utility
│   ├── use-local-storage.ts  # Local storage helper
│   └── use-persistent-state.ts
│
├── types/                    # TypeScript Definitions
│   ├── changelog.ts          # Changelog types
│   └── github.ts             # GitHub API types
│
├── content/                  # Fallback Content (Markdown)
│   ├── blog/
│   ├── articles/
│   ├── projects/
│   └── [other content types]
│
├── public/                   # Static Assets
│   ├── fonts/                # Custom fonts
│   ├── img/                  # Images
│   ├── data/                 # JSON data files
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
│
└── [Config Files]
    ├── package.json          # Dependencies & scripts
    ├── tsconfig.json         # TypeScript config
    ├── tailwind.config.js    # Tailwind config
    ├── next.config.mjs       # Next.js config
    └── eslint.config.mjs     # ESLint config
```

---

## Development Guidelines

### File Naming Conventions

```typescript
// Components: PascalCase
BlogPostCard.tsx
ContactForm.tsx

// Hooks: camelCase with 'use' prefix
useBookmarks.tsx
useDebounce.ts

// Utilities: camelCase
utils.ts
content.ts

// Types: PascalCase with .ts extension
BlogPost.ts
Author.ts

// Routes: lowercase with hyphens for segments
app/blog-posts/page.tsx
app/user-profile/page.tsx
```

### Import Organization

```typescript
// 1. External dependencies
import React from 'react';
import { motion } from 'framer-motion';

// 2. Next.js imports
import Link from 'next/link';
import Image from 'next/image';

// 3. Internal imports (aliased with @/)
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 4. Type imports
import type { BlogPost } from '@/types/blog';

// 5. Style imports
import './styles.css';
```

### Component Structure

```typescript
'use client'; // If using hooks or interactivity

import React from 'react';
import { cn } from '@/lib/utils';

// Types first
interface Props {
  title: string;
  description?: string;
  className?: string;
}

// Component definition
export function ComponentName({ 
  title, 
  description,
  className 
}: Props) {
  return (
    <div className={cn('base-styles', className)}>
      {/* Content */}
    </div>
  );
}

// Default props (if needed)
ComponentName.defaultProps = {
  description: '',
  className: '',
};
```

### Server vs Client Components

```typescript
// ✅ Server Component (Default)
// Use for: Data fetching, static content, SEO
async function BlogList() {
  const posts = await getBlogPosts();
  return <div>{/* render posts */}</div>;
}

// ✅ Client Component (When needed)
// Use for: Interactivity, hooks, browser APIs
'use client';

function SearchBox() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={...} />;
}
```

**Rules:**
1. Default to Server Components
2. Add `'use client'` only when necessary
3. Keep client components at leaf nodes
4. Pass server data as props to client components

---

## Component Patterns

### UI Components (Radix-based)

Located in `components/ui/`:

```typescript
// Button variants
<Button variant="default" | "destructive" | "outline" | "secondary" | "ghost" | "link">
<Button size="default" | "sm" | "lg" | "icon">

// Form components
<Input />
<Textarea />
<Label />
<Select />
<Checkbox />

// Layout components
<Card>
  <CardHeader>
  <CardTitle>
  <CardDescription>
  <CardContent>
  <CardFooter>
</Card>

// Feedback components
<AlertDialog>
<Toast>
<Tooltip>
```

### Content Cards

```typescript
// Standard content card pattern
<article className="group relative overflow-hidden rounded-[1.5rem] border border-border/40 bg-card transition-all hover:border-primary/50 hover:shadow-lg">
  <div className="aspect-video overflow-hidden">
    <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
  </div>
  
  <div className="p-6">
    <div className="mb-2 flex items-center gap-2">
      <Badge>{category}</Badge>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
    
    <h3 className="mb-2 text-xl font-bold group-hover:text-primary">{title}</h3>
    <p className="text-muted-foreground line-clamp-2">{description}</p>
  </div>
</article>
```

### Form Pattern

```typescript
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // Submit to server action or API
      await submitContact(formData);
      
      toast.success('Message sent!');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required />
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
```

---

## API Integration

### Notion API

**Client Setup** (`lib/notion.ts`):

```typescript
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
  auth: process.env.NOTION_AUTH_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });
```

**Fetching Content**:

```typescript
// Get database entries
const response = await notion.databases.query({
  database_id: process.env.NOTION_BLOG_ID!,
  filter: {
    property: 'Status',
    select: { equals: 'Published' },
  },
  sorts: [
    {
      property: 'Date',
      direction: 'descending',
    },
  ],
});

// Convert to markdown
const mdblocks = await n2m.pageToMarkdown(pageId);
const mdBody = n2m.toMarkdown(mdblocks);
```

**Environment Variables**:

```env
NOTION_AUTH_TOKEN=secret_xxx
NOTION_BLOG_ID=database_id
NOTION_ARTICLES_ID=database_id
NOTION_PROJECTS_ID=database_id
NOTION_TUTORIALS_ID=database_id
NOTION_WIKI_ID=database_id
NOTION_AUTHORS_ID=database_id
```

### GitHub API

```typescript
// lib/github.ts
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Server-side only!

async function fetchRepoInfo(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  
  return res.json();
}
```

### REST API Routes

**Creating an API Route**:

```typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }
  
  // Search logic
  const results = await searchContent(query);
  
  return NextResponse.json({ results });
}
```

---

## Content Management

### Notion Database Schema

**Standard Properties**:

| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Content title |
| Slug | Text | URL slug |
| Authors | Relation | Link to Authors DB |
| Date | Date | Publication date |
| Status | Select | Published/Draft |
| Description | Text | Summary |
| Tags | Multi-select | Keywords |
| Categories | Select | Category |
| AIAssisted | Checkbox | AI indicator |
| Technical | Multi-select | Tech stack |

**Authors Database**:

| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Author name |
| Slug | Text | URL slug |
| Role | Text | Job title |
| Biography | Text | Bio |
| Avatar | Files | Profile photo |
| Twitter | Text | Username |
| GitHub | Text | Username |
| LinkedIn | Text | Username |
| Status | Select | Published/Draft |

### Content Rendering

**Markdown Processing** (`lib/content.ts`):

```typescript
import { marked } from 'marked';
import { createHighlighter } from 'shiki';

// Configure marked
const renderer = new marked.Renderer();
renderer.heading = ({ text, depth }) => {
  const id = text.toLowerCase().replace(/[^\\w]+/g, '-');
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

// Syntax highlighting
const highlighter = await createHighlighter({
  themes: ['one-dark-pro'],
  langs: ['javascript', 'typescript', 'python', /* ... */],
});

// Render content
const html = marked(markdownContent, { renderer });
const highlightedHtml = await highlightCodeBlocks(html);
```

### Special Features

**Quizzes**:

```markdown
[quiz]
{
  "questions": [
    {
      "question": "What is Next.js?",
      "options": ["Framework", "Library", "Database"],
      "answer": 0
    }
  ]
}
[/quiz]
```

**GitHub Alerts**:

```markdown
> [!NOTE]
> Additional information

> [!TIP]
> Helpful advice

> [!WARNING]
> Important caution

> [!ERROR]
> Critical issue
```

**Math Equations**:

```markdown
Inline: $E = mc^2$

Block:
$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
```

---

## Testing Strategy

### Unit Testing (Vitest)

```typescript
// tests/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Integration Testing (Playwright)

```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toHaveTitle(/Engineering Workspace/);
  await expect(page.locator('text=Featured')).toBeVisible();
  await expect(page.locator('nav')).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Blog');
  await expect(page).toHaveURL('/blog');
});
```

### Test Commands

```bash
# Run unit tests
pnpm test

# Run with UI
pnpm test:ui

# Run coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E with UI
pnpm test:e2e:ui
```

---

## Common Tasks

### Adding a New Page

1. **Create route folder**:
```bash
mkdir -p app/new-feature
```

2. **Create page component**:
```typescript
// app/new-feature/page.tsx
export default function NewFeaturePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl font-bold">New Feature</h1>
      {/* Content */}
    </div>
  );
}
```

3. **Add to navigation**:
```typescript
// components/navigation.tsx
<Link href="/new-feature">New Feature</Link>
```

### Adding a New Component

1. **Create component file**:
```typescript
// components/my-component.tsx
'use client';

import React from 'react';

interface Props {
  title: string;
}

export function MyComponent({ title }: Props) {
  return <div>{title}</div>;
}
```

2. **Export from components directory** (optional for index pattern)

3. **Use in pages**:
```typescript
import { MyComponent } from '@/components/my-component';
```

### Adding API Endpoint

1. **Create route file**:
```typescript
// app/api/my-api/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

### Updating Styles

1. **Global styles**: Edit `app/globals.css`
2. **Component styles**: Use Tailwind classes
3. **Custom utilities**: Add to `lib/utils.ts`

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Managing Environment Variables

1. **Add to `.env.local.example`**:
```env
NEW_API_KEY=your_api_key_here
```

2. **Update `.env.local`** (not committed to git)

3. **Access in code**:
```typescript
// Server-side
const apiKey = process.env.NEW_API_KEY;

// Client-side (only if NEXT_PUBLIC_ prefix)
const publicVar = process.env.NEXT_PUBLIC_SOME_VAR;
```

---

## Troubleshooting

### Common Issues

#### 1. Notion Content Not Loading

**Symptoms**: Empty pages, fallback content shown

**Solutions**:
- Check environment variables are set
- Verify database IDs are correct
- Ensure databases are shared with integration
- Check Notion API token is valid
- Look for errors in server logs

```bash
# Test Notion connection
curl -H "Authorization: Bearer $NOTION_AUTH_TOKEN" \
  https://api.notion.com/v1/users/me
```

#### 2. Build Errors

**TypeScript Errors**:
```bash
# Check types
pnpm tsc --noEmit

# Fix common issues
# - Missing types: npm install -D @types/package-name
# - Import errors: Check paths and exports
```

**Build Failures**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

#### 3. Styling Issues

**Tailwind not applying**:
- Check content paths in `tailwind.config.js`
- Ensure classes are complete strings (no dynamic concatenation)
- Restart dev server after config changes

**Dark mode not working**:
- Verify `ThemeProvider` is wrapping content
- Check `class` strategy in tailwind config
- Ensure dark: prefix is used correctly

#### 4. Performance Issues

**Slow page loads**:
```bash
# Analyze bundle
ANALYZE=true pnpm build

# Check Lighthouse
pnpm dlx lighthouse http://localhost:3000
```

**Large bundle size**:
- Use dynamic imports for heavy components
- Tree-shake unused dependencies
- Optimize images with Next.js Image component

#### 5. Hydration Mismatches

**Error**: "Hydration failed because the initial UI does not match"

**Causes**:
- Browser extensions modifying DOM
- Using `window` or `localStorage` during SSR
- Random values generated on render

**Solutions**:
```typescript
// Use useEffect for browser-only code
useEffect(() => {
  const value = localStorage.getItem('key');
}, []);

// Suppress hydration warning for known differences
<div suppressHydrationWarning>{/* content */}</div>
```

### Debugging Tips

```typescript
// Enable debug logging
console.log('Environment:', {
  notionEnabled: !!process.env.NOTION_AUTH_TOKEN,
  blogId: process.env.NOTION_BLOG_ID,
});

// Use React DevTools
// Install browser extension for component inspection

// Use Next.js DevTools
// Check Network tab for API calls
// Check Console for errors
```

### Getting Help

1. **Check existing documentation**: README.md, DESIGN.md, Notion-Instruction.md
2. **Review error messages carefully**
3. **Search GitHub issues**
4. **Check Next.js docs**: https://nextjs.org/docs
5. **Review component library docs**: https://ui.shadcn.com/docs

---

## Quick Reference

### Useful Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # Run ESLint
pnpm lint:fix              # Fix lint errors

# Testing
pnpm test                   # Run unit tests
pnpm test:e2e              # Run E2E tests

# Utilities
pnpm analyze               # Bundle analysis
```

### File Templates

**New Component**:
```typescript
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export function ComponentName({ className }: Props) {
  return (
    <div className={cn('base-class', className)}>
      {/* Implementation */}
    </div>
  );
}
```

**New Page**:
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl font-bold">Page Title</h1>
    </div>
  );
}
```

**API Route**:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ data: 'result' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Message' },
      { status: 500 }
    );
  }
}
```

---

*Last Updated: 2024*
*Maintained by: Engineering Team*
