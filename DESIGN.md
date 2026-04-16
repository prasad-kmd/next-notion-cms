# Design System Documentation

Comprehensive design system documentation for the Engineering Workspace platform.

---

## Table of Contents

- [Design Principles](#design-principles)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Components](#components)
- [Icons](#icons)
- [Animations](#animations)
- [Accessibility](#accessibility)
- [Responsive Design](#responsive-design)

---

## Design Principles

### 1. Technical Excellence

Our design reflects precision, clarity, and technical sophistication appropriate for engineering documentation.

- **Clarity**: Information hierarchy is clear and scannable
- **Precision**: Consistent spacing, alignment, and proportions
- **Functionality**: Every design element serves a purpose

### 2. Performance-First

Design decisions prioritize performance:

- Minimal visual complexity
- Efficient animations
- Optimized asset loading
- Progressive enhancement

### 3. Accessibility

Inclusive by default:

- WCAG 2.1 AA compliance target
- Keyboard navigation support
- Screen reader compatibility
- Color contrast standards

### 4. Dark Mode Native

Designed for both light and dark modes from the ground up:

- Separate color palettes for each theme
- Consistent experience across themes
- Respects system preferences

---

## Color System

### Light Theme Palette

```css
:root {
  /* Background Colors */
  --background: hsl(216 100% 98%);      /* #F5F8FF - Primary background */
  --card: hsl(0 0% 100%);                /* #FFFFFF - Card backgrounds */
  --popover: hsl(0 0% 100%);             /* #FFFFFF - Popovers, modals */
  
  /* Foreground Colors */
  --foreground: hsl(220 27% 4%);         /* #0A0E14 - Primary text */
  --card-foreground: hsl(220 27% 4%);    /* #0A0E14 - Card text */
  --popover-foreground: hsl(220 27% 4%); /* #0A0E14 - Popover text */
  
  /* Primary Brand Color (Teal) */
  --primary: hsl(181 100% 28%);          /* #008B8B - Brand teal */
  --primary-foreground: hsl(216 100% 98%);/* #F5F8FF - Text on primary */
  
  /* Secondary Colors */
  --secondary: hsl(216 20% 90%);         /* #E3E7EE - Secondary elements */
  --secondary-foreground: hsl(220 27% 4%);/* #0A0E14 - Text on secondary */
  
  /* Muted Colors */
  --muted: hsl(216 20% 90%);             /* #E3E7EE - Muted backgrounds */
  --muted-foreground: hsl(220 5% 34%);   /* #5C6370 - Muted text */
  
  /* Accent Colors */
  --accent: hsl(216 20% 90%);            /* #E3E7EE - Accent backgrounds */
  --accent-foreground: hsl(220 27% 4%);  /* #0A0E14 - Text on accent */
  
  /* Destructive/Error Colors */
  --destructive: hsl(3 65% 55%);         /* #DC5858 - Error states */
  --destructive-foreground: hsl(0 0% 97%);/* #F7F7F7 - Text on destructive */
  
  /* UI Elements */
  --border: hsl(222 13% 85%);            /* #D4D9E0 - Borders, dividers */
  --input: hsl(222 13% 85%);             /* #D4D9E0 - Input backgrounds */
  --ring: hsl(181 100% 28%);             /* #008B8B - Focus rings */
  
  /* Chart Colors */
  --chart-1: hsl(181 100% 28%);          /* Primary teal */
  --chart-2: hsl(131 73% 35%);           /* Green */
  --chart-3: hsl(39 100% 39%);           /* Orange */
  --chart-4: hsl(352 94% 38%);           /* Red */
  --chart-5: hsl(289 44% 52%);           /* Purple */
  
  /* Sidebar */
  --sidebar: hsl(218 48% 95%);           /* #E8ECF5 - Sidebar background */
  --sidebar-foreground: hsl(220 27% 4%); /* #0A0E14 - Sidebar text */
  --sidebar-primary: hsl(181 100% 28%);  /* #008B8B - Sidebar accent */
  --sidebar-border: hsl(222 13% 85%);    /* #D4D9E0 - Sidebar borders */
}
```

### Dark Theme Palette

```css
.dark {
  /* Background Colors */
  --background: hsl(220 27% 4%);         /* #0A0E14 - Deep navy black */
  --card: hsl(214 19% 7%);               /* #12161F - Card backgrounds */
  --popover: hsl(214 19% 7%);            /* #12161F - Popovers */
  
  /* Foreground Colors */
  --foreground: hsl(216 33% 94%);        /* #E8EBF0 - Primary text */
  --card-foreground: hsl(216 33% 94%);   /* #E8EBF0 - Card text */
  --popover-foreground: hsl(216 33% 94%);/* #E8EBF0 - Popover text */
  
  /* Primary Brand Color (Bright Teal) */
  --primary: hsl(180 100% 34%);          /* #00CCCC - Vibrant teal */
  --primary-foreground: hsl(220 27% 4%); /* #0A0E14 - Text on primary */
  
  /* Secondary Colors */
  --secondary: hsl(218 11% 14%);         /* #1E2229 - Secondary elements */
  --secondary-foreground: hsl(216 33% 94%);/* #E8EBF0 - Text on secondary */
  
  /* Muted Colors */
  --muted: hsl(214 13% 11%);             /* #16191F - Muted backgrounds */
  --muted-foreground: hsl(220 4% 57%);   /* #8B929A - Muted text */
  
  /* Accent Colors */
  --accent: hsl(218 11% 14%);            /* #1E2229 - Accent backgrounds */
  --accent-foreground: hsl(216 33% 94%); /* #E8EBF0 - Text on accent */
  
  /* Destructive/Error Colors */
  --destructive: hsl(357 100% 45%);      /* #FF4757 - Error states */
  --destructive-foreground: hsl(0 0% 98%);/* #FAFAFA - Text on destructive */
  
  /* UI Elements */
  --border: hsl(218 10% 16%);            /* #242933 - Borders, dividers */
  --input: hsl(218 10% 16%);             /* #242933 - Input backgrounds */
  --ring: hsl(180 100% 34%);             /* #00CCCC - Focus rings */
  
  /* Chart Colors */
  --chart-1: hsl(180 100% 34%);          /* Bright teal */
  --chart-2: hsl(126 46% 50%);           /* Bright green */
  --chart-3: hsl(41 100% 45%);           /* Bright orange */
  --chart-4: hsl(359 71% 55%);           /* Bright red */
  --chart-5: hsl(289 61% 65%);           /* Bright purple */
  
  /* Sidebar */
  --sidebar: hsl(223 24% 6%);            /* #0C1016 - Sidebar background */
  --sidebar-foreground: hsl(216 33% 94%);/* #E8EBF0 - Sidebar text */
  --sidebar-primary: hsl(180 100% 34%);  /* #00CCCC - Sidebar accent */
  --sidebar-border: hsl(218 10% 16%);    /* #242933 - Sidebar borders */
}
```

### Color Usage Guidelines

#### Primary Color (Teal)

**Usage:**
- Primary buttons and CTAs
- Links and interactive elements
- Active states
- Brand highlights
- Focus rings

**Do's:**
- ✅ Use for primary actions only
- ✅ Ensure sufficient contrast (4.5:1 minimum)
- ✅ Pair with neutral backgrounds

**Don'ts:**
- ❌ Don't use for large background areas
- ❌ Don't combine with other saturated colors
- ❌ Don't use for error or warning states

#### Semantic Colors

| Color | Usage | Example |
|-------|-------|---------|
| `--destructive` | Errors, warnings, destructive actions | Delete buttons, form errors |
| `--primary` | Success, confirmation, primary actions | Submit buttons, success messages |
| `--muted` | Disabled states, secondary information | Placeholder text, disabled inputs |

### Gradients

```css
/* Page Gradient - Subtle vertical gradient for page backgrounds */
--page-gradient: linear-gradient(
  to bottom,
  rgba(255, 255, 255, 0.4) 0%,
  rgba(255, 255, 255, 0.6) 25%,
  rgba(255, 255, 255, 0.8) 40%,
  rgba(255, 255, 255, 0.9) 60%,
  rgba(255, 255, 255, 1) 75%
);

/* Item Gradient - Diagonal gradient for cards and items */
--item-gradient: linear-gradient(
  45deg,
  rgba(255, 255, 255, 0) 0%,
  rgba(255, 255, 255, 0.2) 30%,
  rgba(255, 255, 255, 0.4) 40%,
  rgba(255, 255, 255, 0.5) 50%,
  rgba(255, 255, 255, 0.7) 65%,
  rgba(255, 255, 255, 0.9) 90%
);
```

---

## Typography

### Font Families

#### Primary Sans-Serif

**Local Inter** (`--font-local-inter`)
- Usage: Body text, UI elements
- Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- Fallback: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

#### Display Fonts

**Amoria Regular** (`--font-amoria-regular`)
- Usage: Hero headings, feature titles
- Style: Elegant, technical display font
- Weight: Regular (400)

**Mozilla Headline** (`--font-mozilla-headline`)
- Usage: Section headings, page titles
- Style: Modern, clean headlines
- Weight: Regular (400)

**Philosopher** (`--font-philosopher`)
- Usage: Special headings, quotes
- Style: Humanist sans-serif
- Weight: Regular (400)

#### Monospace

**JetBrains Mono** (`--font-local-jetbrains-mono`)
- Usage: Code blocks, inline code, technical data
- Weights: 400 (Regular), 500 (Medium), 700 (Bold)
- Features: Ligatures enabled

### Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| `text-xs` | 0.75rem (12px) | 1rem | 400 | Captions, labels |
| `text-sm` | 0.875rem (14px) | 1.25rem | 400 | Small text, helper text |
| `text-base` | 1rem (16px) | 1.5rem | 400 | Body text |
| `text-lg` | 1.125rem (18px) | 1.75rem | 400 | Lead paragraphs |
| `text-xl` | 1.25rem (20px) | 1.75rem | 600 | Subheadings |
| `text-2xl` | 1.5rem (24px) | 2rem | 700 | Section headings |
| `text-3xl` | 1.875rem (30px) | 2.25rem | 700 | Page headings |
| `text-4xl` | 2.25rem (36px) | 2.5rem | 800 | Hero headings |

### Font Classes

```typescript
// Tailwind utility classes for font families
.google-sans { font-family: var(--font-google-sans); }
.local-inter { font-family: var(--font-local-inter); }
.philosopher { font-family: var(--font-philosopher); }
.amoriaregular { font-family: var(--font-amoria-regular); }
.mozilla-headline { font-family: var(--font-mozilla-headline); }
.local-jetbrains-mono { font-family: var(--font-local-jetbrains-mono); }
```

### Typography Best Practices

#### Heading Hierarchy

```tsx
// Correct heading hierarchy
<h1>Page Title</h1>        {/* text-4xl, font-black, mozilla-headline */}
<h2>Section Heading</h2>   {/* text-3xl, font-bold, philosopher */}
<h3>Subsection</h3>        {/* text-2xl, font-semibold */}
<h4>Sub-subsection</h4>    {/* text-xl, font-semibold */}
```

#### Line Length

Optimal line length for readability: **45-75 characters**

```tsx
// Apply max-width for readable line length
<article className="max-w-[65ch]">
  {/* Content */}
</article>
```

#### Text Colors

```tsx
// Primary text
<p className="text-foreground">Main content</p>

// Secondary/muted text
<p className="text-muted-foreground">Supporting info</p>

// Important/emphasized text
<p className="text-primary">Key information</p>
```

---

## Spacing & Layout

### Spacing Scale

Based on a 4px base unit:

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 0.25rem (4px) | Tight spacing |
| `2` | 0.5rem (8px) | Icon gaps |
| `3` | 0.75rem (12px) | Component padding |
| `4` | 1rem (16px) | Standard gap |
| `5` | 1.25rem (20px) | Section padding |
| `6` | 1.5rem (24px) | Large gaps |
| `8` | 2rem (32px) | Section margins |
| `10` | 2.5rem (40px) | Large sections |
| `12` | 3rem (48px) | Page sections |
| `16` | 4rem (64px) | Major divisions |
| `20` | 5rem (80px) | Hero sections |

### Layout Grid

#### Container Widths

```css
.max-w-6xl { max-width: 1280px; }  /* Main content container */
.max-w-4xl { max-width: 896px; }   /* Article content */
.max-w-2xl { max-width: 672px; }   │ Narrow content */
```

#### Responsive Breakpoints

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Layout Patterns

#### Centered Container

```tsx
<section className="px-6 py-20 lg:px-8">
  <div className="mx-auto max-w-6xl">
    {/* Content */}
  </div>
</section>
```

#### Two-Column Layout

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  {/* Cards */}
</div>
```

#### Sidebar Layout

```tsx
<div className="flex">
  {/* Sidebar - Hidden on mobile, fixed on desktop */}
  <aside className="hidden lg:block w-[256px] fixed">
    {/* Sidebar content */}
  </aside>
  
  {/* Main content - Offset by sidebar width */}
  <main className="lg:pl-[256px]">
    {/* Page content */}
  </main>
</div>
```

---

## Components

### Button Variants

```typescript
// Based on Radix UI + Tailwind
const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};
```

### Card Styles

```tsx
// Base card component
<Card className="rounded-[1.5rem] border border-border/40 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle className="text-lg font-bold">{title}</CardTitle>
    <CardDescription className="text-muted-foreground">
      {description}
    </CardDescription>
  </CardHeader>
  <CardContent>{children}</CardContent>
  <CardFooter>{actions}</CardFooter>
</Card>
```

### Input Fields

```tsx
<Input 
  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
/>
```

### Alert Styles

```tsx
// GitHub-style alerts
<div className="my-6 rounded-lg border-l-4 p-4" role="alert">
  {/* Note */}
  <div className="border-blue-500 bg-blue-50 dark:bg-blue-900/20">
    <strong>Note:</strong> Additional information
  </div>
  
  {/* Tip */}
  <div className="border-green-500 bg-green-50 dark:bg-green-900/20">
    <strong>Tip:</strong> Helpful advice
  </div>
  
  {/* Warning */}
  <div className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
    <strong>Warning:</strong> Important caution
  </div>
  
  {/* Error */}
  <div className="border-red-500 bg-red-50 dark:bg-red-900/20">
    <strong>Error:</strong> Critical issue
  </div>
</div>
```

### Code Blocks

```tsx
// Premium Shiki highlighting with Mac-style window
<div className="code-block-wrapper my-12 rounded-2xl overflow-hidden border border-border/40 bg-[#1e1e1e] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
  {/* macOS-style traffic lights */}
  <div className="code-block-header flex items-center justify-between px-3 py-1 bg-[#252526] border-b border-white/5">
    <div className="flex gap-2.5">
      <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f57]"></div>
      <div className="w-3.5 h-3.5 rounded-full bg-[#febc2e]"></div>
      <div className="w-3.5 h-3.5 rounded-full bg-[#28c840]"></div>
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
      {language}
    </span>
  </div>
  
  {/* Code content with line numbers */}
  <div className="overflow-x-auto">
    <pre className="p-4">
      <code>{highlightedCode}</code>
    </pre>
  </div>
</div>
```

---

## Icons

### Icon Library

**Primary:** Lucide React

```bash
pnpm add lucide-react
```

### Icon Sizes

| Context | Size | Class |
|---------|------|-------|
| Inline text | 16px | `w-4 h-4` |
| Buttons | 18px | `w-[18px] h-[18px]` |
| Navigation | 20px | `w-5 h-5` |
| Features | 24px | `w-6 h-6` |
| Hero | 32px | `w-8 h-8` |
| Display | 48px+ | `w-12 h-12` |

### Icon Usage

```tsx
import { ArrowRight, Github, ExternalLink } from 'lucide-react';

// Button with icon
<Button>
  Continue
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>

// Standalone icon button
<Button variant="ghost" size="icon">
  <Github className="h-5 w-5" />
</Button>

// Link with external icon
<a href={url}>
  Learn more
  <ExternalLink className="inline ml-1 h-3 w-3" />
</a>
```

---

## Animations

### Animation Principles

1. **Purposeful**: Every animation serves a functional purpose
2. **Subtle**: Avoid excessive motion
3. **Performant**: Use CSS transforms and opacity
4. **Accessible**: Respect `prefers-reduced-motion`

### Easing Functions

```css
/* Custom easing curves */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
```

### Common Animations

#### Fade In

```tsx
<FadeIn duration={0.5} delay={0.1}>
  {/* Content */}
</FadeIn>
```

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Slide Up

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Scale In

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Animation Durations

| Type | Duration | Usage |
|------|----------|-------|
| Fast | 150ms | Micro-interactions, hover states |
| Normal | 300ms | Standard transitions |
| Slow | 500ms | Major state changes |
| Very Slow | 700ms+ | Complex sequences |

### Framer Motion Integration

```tsx
import { motion } from 'framer-motion';

// Variant for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

<motion.div variants={containerVariants}>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Accessibility

### Color Contrast

All text meets WCAG 2.1 AA standards:

- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text** (18px+ bold, 24px+): 3:1 minimum
- **UI components**: 3:1 minimum

### Focus States

```css
/* Visible focus indicator */
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Remove default outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Skip Links

```tsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md"
>
  Skip to main content
</a>
```

### ARIA Labels

```tsx
// Icon-only buttons
<button aria-label="Close modal">
  <X size={20} />
</button>

// Navigation landmarks
<nav aria-label="Main navigation">
  {/* Nav content */}
</nav>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>
```

### Keyboard Navigation

All interactive elements are keyboard accessible:

- **Tab**: Move between interactive elements
- **Enter/Space**: Activate buttons, links
- **Escape**: Close modals, dropdowns
- **Arrow keys**: Navigate within components

---

## Responsive Design

### Mobile-First Approach

```tsx
// Start with mobile styles, add breakpoints for larger screens
<div className="
  grid grid-cols-1           /* Mobile: 1 column */
  sm:grid-cols-2             /* Tablet: 2 columns */
  lg:grid-cols-4             /* Desktop: 4 columns */
">
  {/* Cards */}
</div>
```

### Responsive Typography

```tsx
<h2 className="
  text-2xl                   /* Mobile */
  sm:text-3xl                /* Tablet */
  lg:text-4xl                /* Desktop */
">
  Heading
</h2>
```

### Responsive Images

```tsx
<Image
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={630}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  priority
/>
```

### Touch Targets

Minimum touch target size: **44x44px**

```tsx
// Ensure buttons and links have adequate touch targets
<Button className="min-h-[44px] min-w-[44px]">
  Action
</Button>
```

---

## Component Examples

### Hero Section

```tsx
<section className="relative overflow-hidden">
  {/* Background gradient */}
  <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
  
  {/* Content */}
  <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-32">
    <h1 className="mb-6 text-4xl font-black mozilla-headline lg:text-6xl">
      Engineering Excellence
    </h1>
    <p className="max-w-2xl text-lg text-muted-foreground local-inter">
      Documenting our journey in mechanical and mechatronics engineering
    </p>
  </div>
</section>
```

### Content Card

```tsx
<article className="group relative overflow-hidden rounded-[1.5rem] border border-border/40 bg-card transition-all hover:border-primary/50 hover:shadow-lg">
  {/* Image */}
  <div className="aspect-video overflow-hidden">
    <Image
      src={image}
      alt={title}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  </div>
  
  {/* Content */}
  <div className="p-6">
    <div className="mb-2 flex items-center gap-2">
      <Badge>{category}</Badge>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
    
    <h3 className="mb-2 text-xl font-bold group-hover:text-primary">
      {title}
    </h3>
    
    <p className="text-muted-foreground line-clamp-2">
      {description}
    </p>
  </div>
</article>
```

### Navigation

```tsx
<nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
    {/* Logo */}
    <Link href="/" className="font-bold mozilla-headline">
      Engineering Workspace
    </Link>
    
    {/* Navigation Links */}
    <div className="flex items-center gap-6">
      <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Blog
      </Link>
      <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Projects
      </Link>
      {/* More links... */}
    </div>
  </div>
</nav>
```

---

## Design Tokens Summary

### Complete Token Reference

```css
:root {
  /* Colors */
  --background, --foreground
  --card, --card-foreground
  --popover, --popover-foreground
  --primary, --primary-foreground
  --secondary, --secondary-foreground
  --muted, --muted-foreground
  --accent, --accent-foreground
  --destructive, --destructive-foreground
  --border, --input, --ring
  
  /* Charts */
  --chart-1 through --chart-5
  
  /* Sidebar */
  --sidebar, --sidebar-foreground, --sidebar-primary, etc.
  
  /* Typography */
  --font-local-inter
  --font-amoria-regular
  --font-mozilla-headline
  --font-philosopher
  --font-google-sans
  --font-mozilla-text
  --font-noto-sans
  --font-noto-sans-display
  --font-noto-serif-sinhala
  --font-roboto
  --font-space-mono
  --font-local-jetbrains-mono
  
  /* Spacing */
  --sidebar-width: 256px
  
  /* Effects */
  --radius: 0.625rem
  --page-gradient
  --item-gradient
}
```

---

*Last Updated: 2024*
*Maintained by: Engineering Team*
