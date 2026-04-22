# Components Reference

Comprehensive guide to the UI component library in Next Notion CMS.

## Table of Contents

- [Overview](#overview)
- [Base Components](#base-components)
- [Layout Components](#layout-components)
- [Content Components](#content-components)
- [Interactive Components](#interactive-components)
- [Authentication Components](#authentication-components)
- [Dashboard Components](#dashboard-components)
- [Component Usage Examples](#component-usage-examples)

---

## Overview

Next Notion CMS includes a comprehensive component library built with **Radix UI primitives**, **Tailwind CSS**, and **TypeScript**. All components are designed for accessibility, performance, and reusability.

### Component Categories

| Category | Location | Description |
|----------|---------|-------------|
| **Base** | `components/ui/` | Fundamental UI elements (buttons, inputs, etc.) |
| **Layout** | `components/` | Structural components (navbar, footer, etc.) |
| **Content** | `components/` | Content display components |
| **Interactive** | `components/` | User interaction components |
| **Auth** | `components/auth/` | Authentication-related components |
| **Dashboard** | `components/dashboard/` | Dashboard-specific widgets |

---

## Base Components

Located in `components/ui/`, these are the building blocks of the UI.

### Button

```typescript
import { Button } from '@/components/ui/button';

// Variants: default, secondary, outline, ghost, link, destructive
<Button variant="default">Click Me</Button>
<Button variant="outline" size="sm">Small</Button>
```

**Props:**
- `variant`: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `disabled`: boolean
- `loading`: boolean
- `onClick`: () => void

### Input

```typescript
import { Input } from '@/components/ui/input';

<Input 
  type="email" 
  placeholder="Enter email" 
  label="Email Address"
  error={errors.email}
/>
```

**Props:**
- `type`: HTML input type
- `placeholder`: string
- `label`: string (optional)
- `error`: string (optional)
- `onChange`: (e: ChangeEvent) => void

### Card

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Dialog/Modal

```typescript
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <h2>Dialog Title</h2>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

### Tooltip

```typescript
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

<Tooltip>
  <TooltipTrigger>Hover me</TooltipTrigger>
  <TooltipContent>
    <p>Helpful information</p>
  </TooltipContent>
</Tooltip>
```

---

## Layout Components

### FloatingNavbar

The main navigation bar with smooth animations and responsive design.

```typescript
import { FloatingNavbar } from '@/components/navigation';

<FloatingNavbar 
  items={[
    { name: 'Blog', path: '/blog' },
    { name: 'Articles', path: '/articles' },
    { name: 'Projects', path: '/projects' },
  ]}
/>
```

**Features:**
- Auto-hide on scroll down
- Smooth GSAP animations
- Mobile-responsive hamburger menu
- Active state highlighting
- Search integration (Cmd+K)

### Footer

```typescript
import { Footer } from '@/components/footer';

<Footer 
  links={[
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]}
  socialLinks={{
    github: 'https://github.com/...',
    twitter: 'https://twitter.com/...',
  }}
/>
```

### Container

Wrapper component for consistent content padding and max-width.

```typescript
import { Container } from '@/components/container';

<Container className="py-8">
  {children}
</Container>
```

---

## Content Components

### ContentCard

Displays content previews with specialized designs for different types.

```typescript
import { ContentCard } from '@/components/content-card';

<ContentCard
  type="blog" // 'blog' | 'article' | 'project' | 'tutorial'
  title="My Blog Post"
  description="A brief description"
  image="/path/to/image.jpg"
  date="2024-01-01"
  tags={['React', 'Next.js']}
  href="/blog/my-post"
  author={{ name: 'John Doe', avatar: '/avatar.jpg' }}
/>
```

**Visual Identities:**
- **Blog**: Journal-style with casual aesthetics
- **Article**: Technical publication look
- **Project**: Blueprint/engineering schematic
- **Tutorial**: Step-by-step guide style

### ContentRenderer

Renders processed Markdown/HTML with all enhancements.

```typescript
import { ContentRenderer } from '@/components/content-renderer';

<ContentRenderer
  content={htmlContent}
  enableToc={true}
  enableQuiz={true}
  enableMath={true}
  enableAlerts={true}
/>
```

**Features:**
- Shiki syntax highlighting
- KaTeX math rendering
- Interactive quizzes
- GitHub-style alerts
- Auto-generated TOC
- Lazy-loaded images

### TableOfContents

Auto-generated table of contents with scroll tracking.

```typescript
import { TableOfContents } from '@/components/toc';

<TableOfContents 
  headings={headings}
  activeId={activeSection}
/>
```

### AuthorProfile

Display author information with social links.

```typescript
import { AuthorProfile } from '@/components/author-profile';

<AuthorProfile
  name="John Doe"
  role="Software Engineer"
  bio="Passionate developer..."
  avatar="/avatar.jpg"
  social={{
    twitter: 'johndoe',
    github: 'johndoe',
    linkedin: 'johndoe',
  }}
/>
```

---

## Interactive Components

### Search

Global search modal with command palette (Cmd+K).

```typescript
import { SearchModal } from '@/components/search';

<SearchModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  initialQuery=""
/>
```

**Features:**
- Full-text search across all content
- Keyboard shortcuts (Cmd+K)
- Recent searches
- Quick navigation
- Fuzzy matching

### Quiz

Interactive quiz component for embedding in content.

```typescript
import { Quiz } from '@/components/quiz';

<Quiz
  questions={[
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is React?',
      options: ['Library', 'Framework', 'Language'],
      correctAnswer: 0,
      explanation: 'React is a JavaScript library...',
    },
  ]}
  onComplete={(score) => console.log(score)}
/>
```

### BookmarkButton

Save content to user's bookmarks.

```typescript
import { BookmarkButton } from '@/components/bookmark-button';

<BookmarkButton
  contentId="post-123"
  contentType="blog"
  initialBookmarked={false}
/>
```

### WebShareButton

Native sharing using Web Share API.

```typescript
import { WebShareButton } from '@/components/web-share-button';

<WebShareButton
  title="Check this out"
  text="Description"
  url="https://example.com"
/>
```

### ScrollToTop

Smooth scroll-to-top button.

```typescript
import { ScrollToTop } from '@/components/scroll-to-top';

<ScrollToTop threshold={300} />
```

---

## Authentication Components

### SignInForm

OAuth sign-in form with multiple providers.

```typescript
import { SignInForm } from '@/components/auth/sign-in-form';

<SignInForm
  providers={['google', 'github', 'facebook']}
  callbackUrl="/dashboard"
/>
```

### UserMenu

Dropdown menu for authenticated users.

```typescript
import { UserMenu } from '@/components/auth/user-menu';

<UserMenu
  user={{ name: 'John', avatar: '/avatar.jpg' }}
  links={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/settings' },
  ]}
/>
```

### AuthGuard

Protect routes requiring authentication.

```typescript
import { AuthGuard } from '@/components/auth/auth-guard';

<AuthGuard requireAdmin>
  <AdminDashboard />
</AuthGuard>
```

---

## Dashboard Components

### DashboardLayout

Main dashboard layout with sidebar.

```typescript
import { DashboardLayout } from '@/components/dashboard/layout';

<DashboardLayout>
  <DashboardSidebar />
  <DashboardContent>
    {children}
  </DashboardContent>
</DashboardLayout>
```

### ProfileCard

User profile summary card.

```typescript
import { ProfileCard } from '@/components/dashboard/profile-card';

<ProfileCard
  user={user}
  stats={{
    posts: 10,
    comments: 50,
    bookmarks: 25,
  }}
/>
```

### AccountConnections

Manage linked OAuth accounts.

```typescript
import { AccountConnections } from '@/components/dashboard/account-connections';

<AccountConnections
  connectedAccounts={accounts}
  availableProviders={['google', 'github', 'twitter']}
/>
```

### BookmarksList

Display user's saved bookmarks.

```typescript
import { BookmarksList } from '@/components/dashboard/bookmarks-list';

<BookmarksList
  bookmarks={bookmarks}
  onDelete={(id) => handleDelete(id)}
/>
```

---

## Component Usage Examples

### Blog Post Page Example

```typescript
import { Container } from '@/components/container';
import { ContentRenderer } from '@/components/content-renderer';
import { TableOfContents } from '@/components/toc';
import { AuthorProfile } from '@/components/author-profile';
import { BookmarkButton } from '@/components/bookmark-button';
import { WebShareButton } from '@/components/web-share-button';
import { Comments } from '@/components/comments';

export default function BlogPost({ post }) {
  return (
    <Container className="max-w-4xl mx-auto py-12">
      {/* Header */}
      <header>
        <h1>{post.title}</h1>
        <AuthorProfile {...post.author} compact />
        <div className="flex gap-2">
          <BookmarkButton contentId={post.id} />
          <WebShareButton title={post.title} url={post.url} />
        </div>
      </header>
      
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Main content */}
        <main className="lg:col-span-3">
          <ContentRenderer 
            content={post.contentHtml}
            enableToc={false}
          />
          <Comments postId={post.id} />
        </main>
        
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <TableOfContents headings={post.headings} />
        </aside>
      </div>
    </Container>
  );
}
```

### Dashboard Page Example

```typescript
import { DashboardLayout } from '@/components/dashboard/layout';
import { ProfileCard } from '@/components/dashboard/profile-card';
import { AccountConnections } from '@/components/dashboard/account-connections';
import { BookmarksList } from '@/components/dashboard/bookmarks-list';

export default function Dashboard({ user, bookmarks }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProfileCard user={user} />
        <AccountConnections accounts={user.accounts} />
        <BookmarksList bookmarks={bookmarks} />
      </div>
    </DashboardLayout>
  );
}
```

---

## Best Practices

### 1. Component Composition

Prefer composition over configuration:

```typescript
// ✅ Good
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Avoid
<Card 
  showHeader 
  title="Title"
  showContent
  content="Content"
/>
```

### 2. Accessibility

Always include proper ARIA attributes:

```typescript
<Button aria-label="Close dialog" onClick={onClose}>
  <XIcon />
</Button>
```

### 3. Performance

Use lazy loading for heavy components:

```typescript
const Quiz = dynamic(() => import('@/components/quiz'), {
  ssr: false,
  loading: () => <Skeleton />,
});
```

### 4. TypeScript

Define clear prop interfaces:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
```

---

## Related Documentation

- [Architecture](architecture.md) - System design overview
- [Getting Started](getting-started.md) - Setup guide
- [Design](../DESIGN.md) - Design principles

---

**Last Updated**: April 2025  
**Version**: 1.0.0
