# DESIGN.md — Frontend Design Specification (Dashboard + Docs + CMS)

This document specifies the **exact frontend look-and-feel** of the target site so design agents can reproduce it with high fidelity. It focuses on **visual tokens, layout geometry, component styling, states, and motion**.

> Personal/brand-specific strings (names, taglines) must be treated as **placeholders** like `<BrandName>` and `<BrandTagline>` while preserving typography, spacing, and hierarchy.

---

## 1) Design intent (what it should feel like)

**Overall aesthetic**
- A modern “technical dashboard” vibe: glassy surfaces, thin borders, muted backgrounds, and a strong teal/cyan accent used sparingly for emphasis. 
- Dense but readable information layout: cards, badges, and micro-labels with high letter-spacing (uppercase, mono) to create “instrument panel” cues. 

**Key differentiators**
- **Desktop** uses a left sidebar + floating utility navbar (top-right).
- **Mobile** uses a top banner + bottom dock bar + slide-in sidebar overlay. 
- Content pages are “docs-polished”: enhanced code blocks, details/toggles, blockquotes, tables, KaTeX styling, and subtle view transitions. 

---

## 2) Global layout & app shell

### 2.1 Root composition
- The UI is wrapped in providers (theme, tooltips, sidebar state, bookmarks, view transitions, etc.).
- The **main content** reserves space for the sidebar on large screens via left padding:
  - `main` has: `transition-[padding] duration-300 lg:pl-(--sidebar-width,256px) overflow-x-clip`. 
- Global text rendering:
  - `body` uses `antialiased`
  - Selection styling is accent-driven: `selection:bg-brand-200 selection:text-brand-900`. 

### 2.2 Grid system (macro)
- Repeated container widths:
  - Many sections center content with `mx-auto` and cap width at `max-w-6xl` / `max-w-7xl`. 
- Section padding pattern:
  - Standard: `px-6 py-20 lg:px-8` for major blocks. 

---

## 3) Design tokens (CSS variables + theme mapping)

All tokens are defined as CSS variables and then consumed by Tailwind color names (e.g., `border`, `muted`, `primary`). 

### 3.1 Core color tokens — Light theme (`:root`)
Use these exact values:

| Token | Value |
|---|---|
| `--background` | `hsl(216 100% 98%)` |
| `--foreground` | `hsl(220 27% 4%)` |
| `--card` | `hsl(0 0% 100%)` |
| `--popover` | `hsl(0 0% 100%)` |
| `--border` / `--input` | `hsl(222 13% 85%)` |
| `--muted` | `hsl(216 20% 90%)` |
| `--muted-foreground` | `hsl(220 5% 34%)` |
| `--destructive` | `hsl(3 65% 55%)` |

Primary accent is parameterized:

| Token | Value |
|---|---|
| `--primary-h` | `181` |
| `--primary-s` | `100%` |
| `--primary-l` | `28%` |
| `--primary` | `hsl(var(--primary-h) var(--primary-s) var(--primary-l))` |
| `--ring` | `var(--primary)` |

Chart colors are also defined, with `--chart-1` = primary. 

### 3.2 Core color tokens — Dark theme (`.dark`)
Exact dark overrides:

| Token | Value |
|---|---|
| `--background` | `hsl(220 27% 4%)` |
| `--foreground` | `hsl(216 33% 94%)` |
| `--card` / `--popover` | `hsl(214 19% 7%)` |
| `--border` / `--input` | `hsl(218 10% 16%)` |
| `--muted` | `hsl(214 13% 11%)` |
| `--muted-foreground` | `hsl(220 4% 57%)` |
| `--destructive` | `hsl(357 100% 45%)` |
| `--primary` | `hsl(var(--primary-h) var(--primary-s) calc(var(--primary-l) + 6%))` |

This keeps the teal/cyan accent but lifts it slightly in dark mode. 

### 3.3 Sidebar tokens
Light sidebar palette:

- `--sidebar: hsl(218 48% 95%)`
- `--sidebar-foreground: hsl(220 27% 4%)`
- `--sidebar-border: hsl(222 13% 85%)`
- `--sidebar-primary: var(--primary)` 

Dark sidebar palette:

- `--sidebar: hsl(223 24% 6%)`
- `--sidebar-foreground: hsl(216 33% 94%)`
- `--sidebar-border: hsl(218 10% 16%)` 

### 3.4 Brand ramp (used for text selection + accents)
- `--brand-200: hsl(var(--primary-h) var(--primary-s) calc(var(--primary-l) + 50%))`
- `--brand-900: hsl(var(--primary-h) var(--primary-s) calc(var(--primary-l) - 20%))` 

### 3.5 Gradients for page identity overlays
These are used as overlays on page background images:

- `--page-gradient` (light): white alpha ramp (0.4 → 1.0)
- `--item-gradient` (light): diagonal white alpha ramp
- Dark mode switches `--page-gradient` to black alpha ramp. 

### 3.6 Radius tokens
- Base: `--radius: 0.625rem`
- Derived:
  - `--radius-sm: calc(var(--radius) - 4px)`
  - `--radius-md: calc(var(--radius) - 2px)`
  - `--radius-lg: var(--radius)`
  - `--radius-xl: calc(var(--radius) + 4px)` 

---

## 4) Typography & fonts

### 4.1 Font loading strategy
Multiple local fonts are loaded and attached to CSS variables (e.g., `--font-mozilla-text`, `--font-roboto`, `--font-space-mono`, `--font-local-inter`, `--font-local-jetbrains-mono`, etc.). 

### 4.2 Utility font classes (must exist)
Global CSS defines “switcher” classes that set `font-family` to these variables:

- `.amoriaregular`
- `.mozilla-headline`
- `.philosopher`
- `.google-sans`
- `.mozilla-text`
- `.noto-sans`, `.noto-sans-display`, `.noto-serif-sinhala`
- `.roboto`
- `.space-mono`
- `.local-inter`
- `.local-jetbrains-mono` 

### 4.3 Typographic hierarchy (observed patterns)
- **Hero headline**: extremely large, heavy, tight leading:
  - `text-6xl md:text-8xl xl:text-9xl font-black ... leading-[0.85] tracking-tight`. 
- **Section titles**: serif-like headline class + bold:
  - `text-3xl font-bold philosopher lg:text-4xl`. 
- **Micro-labels / badges**: tiny uppercase with wide tracking, often mono:
  - `text-[9px] font-bold uppercase tracking-[0.2em] local-jetbrains-mono`. 

---

## 5) Global base styling (scroll, selection, transitions)

### 5.1 Base layer behavior
- All elements apply border color + ring outline:
  - `* { @apply border-border outline-ring/50; }`
- `body`:
  - `@apply bg-background text-foreground;`
- Headings have scroll margin:
  - `h1..h6 { scroll-margin-top: 100px; }` 

### 5.2 Scrollbar styling
- Custom scrollbar width: `5px`
- Thumb: `bg-muted`, hover: `bg-muted-foreground/50`
- Track: transparent-ish background. 

Also includes a utility to fully hide scrollbars: `@utility scrollbar-hide`. 

### 5.3 View transitions (navigation animation)
The site uses View Transitions with a scale + fade effect:

- Old root: scale down to `0.92` + fade out (400ms)
- New root: scale from `1.08` to `1` + fade in (400ms)
- Uses `cubic-bezier(0.4, 0, 0.2, 1)`. 

---

## 6) Navigation system (desktop + mobile)

### 6.1 Desktop sidebar (left)
**Sidebar container**
- Fixed left, full height: `fixed inset-y-0 left-0 z-40`
- Glass effect: `bg-card/70 backdrop-blur-xl`
- Divider: `border-r border-border`
- Motion: `transition-all duration-300 ease-in-out` 

**Widths**
- Expanded: `w-64` (256px)
- Collapsed (desktop): `lg:w-20` (80px), while base remains `w-64` for non-lg
- Slide behavior on mobile: `translate-x-0` vs `-translate-x-full`. 

**Collapse toggle button**
- Desktop-only floating pill button:
  - Positioned: `absolute -right-3 top-20`
  - Shape: `h-6 w-6 rounded-full`
  - `border border-border bg-card`
  - Hover: `hover:scale-110`
  - Contains tooltip-like label that appears on hover. 

**Logo block**
- Uses an icon image (24px) + (when expanded) text stack:
  - Name: `text-xl font-bold ... mozilla-headline`
  - Subtitle: `mt-1 text-xs text-muted-foreground google-sans` 
- Replace the displayed identity with:
  - `<BrandName>`
  - `<BrandSubtitle>` (optional)

**Nav list**
- `nav`: `flex-1 space-y-1 px-3 py-4 overflow-y-auto overflow-x-hidden ...` 

**Nav items (exact state styling)**
Each nav link uses:
- Base: `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all gap-3 ... local-jetbrains-mono`
- Active: `bg-primary/10 text-primary`
- Inactive: `text-muted-foreground hover:bg-muted hover:text-foreground`
- Collapsed behavior:
  - Icon stays visible
  - Label becomes `lg:opacity-0 lg:w-0 lg:overflow-hidden`
  - Tooltip shows label on the right. 

### 6.2 Mobile top banner (always visible)
- Fixed top: `fixed top-0 left-0 right-0 z-40 lg:hidden`
- Glass style: `bg-background/60 backdrop-blur-xl`
- Divider: `border-b border-border/40`
- Centered label uses uppercase + large tracking and a gradient text treatment. 

Replace banner text with `<BrandName>` but keep the style.

### 6.3 Mobile overlay + bottom spacer
- When sidebar is open on mobile, a dimming overlay appears:
  - `fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden`. 
- Extra bottom spacer to avoid overlap with bottom nav:
  - `h-12 lg:hidden`. 

### 6.4 Mobile bottom dock (icon bar)
**Container**
- Fixed bottom: `fixed bottom-0 left-0 right-0 z-50`
- Layout: `flex items-center justify-around px-2 py-1.5`
- Glass: `bg-background/80 backdrop-blur-xl`
- Divider: `border-t border-border`
- Shadow: `shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.1)]`
- Shape: `rounded-t-[2.5rem]`
- Hidden on desktop: `lg:hidden`. 

**Buttons**
- Standard icon button style:
  - `p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors` 
- Sidebar toggle icon is larger (menu vs close):
  - Closed: menu icon `h-6 w-6`
  - Open: X icon `h-6 w-6 text-primary`. 
- Theme toggle:
  - Shows sun/moon with `animate-in zoom-in-50 duration-300`. 

Dock items include: Search (link), Accent picker, Sidebar toggle, Theme toggle, User menu. 

---

## 7) Floating utilities navbar (desktop quick actions)

### 7.1 Placement + container styling
- Desktop floating bar sits top-right:
  - `fixed top-6 right-6 z-60`
- Shape: `p-1 rounded-full`
- Glass: `bg-background/80 backdrop-blur`
- Border + shadow: `border border-border shadow-lg`. 

### 7.2 Internal layout
- Horizontal row: `flex items-center gap-1 ... google-sans`
- Uses vertical separators:
  - `<hr className="h-4 w-px bg-border mx-1" />` 
- Includes:
  - Search component
  - “Pages” shortcut (`/pages`)
  - Share action (web share or clipboard)
  - Bookmarks action (modal)
  - Accent picker
  - Theme toggle
  - User menu 

### 7.3 Icon button style (standard)
- `p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ... google-sans`
- Tooltip appears on bottom (desktop only). 

---

## 8) Hero (homepage) — full-screen dashboard composition

### 8.1 Hero section container
- `section`: `relative min-h-screen flex items-center py-16 lg:py-0 overflow-hidden bg-background`. 

### 8.2 Background effects
**Radial overlay + grid feel**
- Uses an absolute layer with a radial gradient:
  - `bg-[radial-gradient(circle_at_80%_70%,rgba(var(--secondary-rgb),0.05)_0%,transparent_50%)]` 

**Floating glow blobs**
- Left blob: `top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse`
- Right blob: `bottom-1/4 -right-20 ... bg-secondary/10 ... animate-pulse delay-1000` 

### 8.3 Main grid
- Inside container: `container ... mx-auto px-6`
- Two-column grid at large sizes: `grid lg:grid-cols-12 gap-16 items-center`
  - Left text: `lg:col-span-7`
  - Right dashboard card: `lg:col-span-5`. 

### 8.4 Headline + subcopy
**Headline**
- Motion entrance: fade in + slide up.
- Style:
  - `text-6xl md:text-8xl xl:text-9xl font-black amoriaregular leading-[0.85] tracking-tight text-foreground`
- Copy uses a forced line break: `The Future <br /> Is Built.` 

**Subcopy**
- Styled as readable muted paragraph, with bold spans for key terms.   
Replace the domain-specific words with generic equivalents, but keep the bold-span pattern.

### 8.5 Hero CTAs (two pill buttons)
Placed in a flex row:
- Wrapper: `flex flex-wrap gap-6 pt-4` 

**Primary CTA**
- Link to `/projects`
- Style:
  - `inline-flex h-16 items-center justify-center rounded-[2rem] bg-foreground px-12 text-sm font-black text-background`
  - Hover: `hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]`
  - Inner label: uppercase tracking + arrow with translate on hover. 

**Secondary CTA**
- Link to `/blog`
- Style:
  - `inline-flex h-16 items-center justify-center rounded-[2rem] border border-border bg-card/40 px-12 text-sm font-bold backdrop-blur-xl`
  - Hover: `hover:bg-muted hover:border-primary/20`
  - Uppercase tracking. 

### 8.6 Right-side “dashboard” carousel card
**Glow frame**
- Outer glow:
  - `absolute -inset-4 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-[3rem] blur-2xl opacity-50`
  - Hover: `group-hover:opacity-100 transition-opacity duration-1000` 

**Main card**
- `rounded-[3rem] border border-border/40 dark:border-white/10 bg-card/80`
- Padding: `p-4 xl:p-6`
- Depth: `shadow-2xl`
- Blur: `backdrop-blur-3xl`
- Min height: `min-h-[500px]`
- Layout: `flex flex-col overflow-hidden`. 

**Header row**
- “Window dots” (macOS style): three 12px circles in red/yellow/green. 
- Feed badge:
  - `px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] local-jetbrains-mono`
  - Includes pulsing dot `w-1.5 h-1.5 ... animate-pulse`. 

**Carousel panels**
- Panel container: `relative flex-1 rounded-[2rem] overflow-hidden border border-border/40 ... bg-background/40`. 
- Each slide: `absolute inset-0 p-6 flex flex-col`
- Slide transition: `opacity` and `x` with `duration 0.8` and `ease: "circOut"`. 
- Auto-advance interval: **5000ms**. 

**Slide image**
- Wrapper: `relative aspect-video rounded-2xl overflow-hidden mb-6 border border-border/40 ... shadow-2xl`
- Image hover zoom: `transition-transform duration-700 hover:scale-105`
- Bottom gradient overlay: `bg-gradient-to-t from-background/80 via-transparent to-transparent`
- Label chip on image:
  - `px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[8px] font-black text-primary uppercase tracking-widest`. 

**Slide text**
- Title: `text-2xl font-black amoriaregular ... line-clamp-2`
- Quote description: `text-xs text-muted-foreground ... italic` and wrapped in quotes. 

**Slide CTA**
- “Initialize Access” link:
  - `inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary`
  - Hover: text becomes foreground + arrow shifts right. 

**Carousel indicators (exact geometry)**
- Indicator buttons:
  - Base: `h-1.5 ... rounded-full transition-all duration-500`
  - Active: `w-8 bg-primary`
  - Inactive: `w-1.5 bg-border/40 hover:bg-border/60`. 

**Scanning line**
- Decorative horizontal line animates vertically forever:
  - `h-px bg-primary/20 blur-sm`
  - Motion: `top: ["0%","100%","0%"]`, `duration: 10`, `repeat: Infinity`, `ease: "linear"`. 

**Version side label (XL only)**
- Vertical rotated microtext:
  - `text-[10px] font-bold text-muted-foreground local-jetbrains-mono ... vertical-rl rotate-180 uppercase tracking-[0.5em] opacity-40`
  - Copy: `Workspace v2.5.0 // Est. 2024` (keep or replace, not personal). 

---

## 9) “Project Explorer” interactive bento grid (homepage widget)

This widget renders a responsive “bento” grid with hover glow.

**Card grid layout**
- `.card-responsive` is a CSS grid that changes columns at breakpoints:
  - `<600px`: 1 column
  - `≥600px`: 2 columns
  - `≥1024px`: 4 columns + special spanning rules:
    - card 3 spans 2 cols + 2 rows
    - card 4 spans 2 cols + starts at col 1, spans 2 rows
    - card 6 positioned at col 4 row 3 

**Card base style (exact)**
Each card uses:
- `p-5 rounded-xl border border-border bg-card transition-all duration-300 ease-in-out`
- Hover:
  - `hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5` 

**Card content patterns**
- Icon chip: `inline-flex rounded-lg bg-primary/10 p-3 shadow-inner shadow-primary/20`
- Title: `text-xl font-semibold ... text-foreground font-google-sans`
- Subtitle (optional): `text-xs font-medium text-primary ... uppercase tracking-wider local-inter`
- “Latest” nested panel:
  - `rounded-lg bg-muted/40 p-3 border border-border/50 backdrop-blur-sm`
  - Label: `text-[10px] font-bold ... uppercase tracking-widest`. 

---

## 10) Content-type “unique cards” (list/card system)

There is a “unique card” design used for content previews with:
- Glassy background
- Large rounding
- Deep shadows
- Internal micro-labels in mono
- Decorative gridline overlay.

**Base wrapper**
- `bg-card/30 backdrop-blur-xl border border-border/40 rounded-2xl md:rounded-[2.5rem] overflow-hidden`
- Hover:
  - `hover:border-primary/40 hover:bg-card/50 hover:-translate-y-2`
- Very deep shadow: `shadow-2xl`
- Dark mode border tweak: `dark:border-white/5`
- Long transition: `duration-700`. 

**“Technical Document” label style**
- Micro label:
  - `text-[7px] md:text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.4em] local-jetbrains-mono`
- Title:
  - `text-lg md:text-2xl font-black ... amoriaregular`
  - Hover makes title `text-primary`. 

**“Project Blueprint” label**
- Micro label:
  - `text-[7px] md:text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.4em] local-jetbrains-mono`
- Includes three tiny primary dots before it. 

**Tech tag chips**
- Small pills:
  - `text-[8px] font-black text-primary/60 uppercase tracking-widest border border-primary/10 px-2.5 py-1 rounded-md bg-primary/5` 

**Internal gridline decor overlay**
- Absolute overlay at very low opacity:
  - `opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]`. 

---

## 11) Footer design (glassy, animated blobs, multi-column)

### 11.1 Footer container
- Outer wrapper:
  - `relative border-t border-border bg-card/30 backdrop-blur-md overflow-hidden` 

### 11.2 Animated background blobs (decor)
- 3 absolute blobs with `rounded-full blur-[100px+] animate-blob`
- Different sizes/positions and custom durations (25s / 30s / 35s) with negative delays. 

> `animate-blob` is defined in global CSS as a translate+scale keyframe loop. 

### 11.3 Footer grid
- Inner container: `mx-auto max-w-7xl px-6 pt-16 ... pb-24` (extra bottom padding to avoid mobile bottom bar overlap). 
- Link columns: `grid ... md:grid-cols-4 lg:grid-cols-5`
- Brand column spans 2 on md/lg. 

### 11.4 Brand block (replace identity strings)
- Brand icon chip:
  - `h-10 w-10 rounded-xl bg-primary/10`
  - Hover: becomes primary filled `group-hover:bg-primary`
  - Contains an image. 
- Brand name:
  - `text-2xl font-bold mozilla-headline tracking-tight` 
- Small uppercase descriptor line:
  - `text-[10px] uppercase tracking-[0.2em] text-primary/80 font-bold google-sans` 

Replace:
- `<BrandName>`
- `<BrandDescriptor>`
- Description paragraph remains `text-sm text-muted-foreground google-sans leading-relaxed max-w-sm`. 

### 11.5 Social icon buttons
- 36x36-ish square buttons:
  - `h-9 w-9 rounded-lg border border-border bg-background/50 text-muted-foreground`
  - Hover: `hover:border-primary/50 hover:bg-primary/10 hover:text-primary`. 

### 11.6 Column headings + links
- Headings:
  - `text-sm font-bold mb-6 mozilla-headline uppercase tracking-widest flex items-center gap-2`
  - Left icon: `h-4 w-4 text-primary`. 
- Links:
  - `text-sm text-muted-foreground hover:text-primary transition-colors google-sans`
  - External arrow appears on hover:
    - `ArrowUpRight ... opacity-0 -translate-y-1`
    - On hover: `opacity-100 translate-y-0`. 

### 11.7 Bottom bar
- Divider: `mt-16 pt-8 border-t border-border`
- Copy line uses small muted text; replace the brand name and tagline:
  - `text-xs text-muted-foreground google-sans` 
- Tech stack line:
  - `text-[10px] text-muted-foreground/60 font-mono tracking-tight uppercase`
  - Copy: “Built with Next.js 16 & Tailwind CSS 4” 
- Status pill link:
  - `px-4 py-2 rounded-full bg-muted/30 border border-border/50 backdrop-blur-sm`
  - Includes pulsing green dot + microtext “Systems Operational”. 

---

## 12) Page identity backgrounds (section/page skins)

A reusable background helper class:
- `.img_grad_pm` sets:
  - `background-size: cover; background-repeat: no-repeat; background-attachment: fixed; ...` 

Page-specific background-image classes apply `--page-gradient` overlay + an image:
- `.blog_page` → `... url("/img/page/ideas_2.webp")`
- `.blog_item` → `... url("/img/page/ideas_item.webp")`
- `.articles_page` → `... url("/img/page/diary.webp")`
- `.articles_item` → `... url("/img/page/diary_page.webp")`
- `.tutorials_page` → `... url("/img/page/posts.webp")`
- `.projects_page` → `... url("/img/page/workflow.webp")` 

---

## 13) Long-form content styling (“Prose polish”)

### 13.1 Code + monospace
- All `code/kbd/samp/pre` are forced to the JetBrains Mono variable. 

### 13.2 Shiki code blocks (premium)
Shiki blocks include:
- Line number counters (`.line::before`) and low-contrast numbers
- Custom thin scrollbar (6px height in code container)
- Subtle selection color in code. 

### 13.3 Details / toggle blocks
- `details` in prose becomes a glass card:
  - `border border-border/50 bg-background/50 backdrop-blur-md rounded-3xl my-6 transition-all duration-300`
  - Shadow: `0 4px 20px -10px rgba(0,0,0,0.1)`
- Hover strengthens border/shadow using primary tint.
- Open state becomes more “card-like”: `bg-card/80 border-primary/20 pb-4`
- Summary row:
  - bold, padded, flex layout
  - Custom chevron implemented via `summary::before` rotated when open. 

### 13.4 Blockquotes
- Styled as a left-accented, tinted panel:
  - `border-l-4 border-primary/80`
  - `bg-linear-to-r from-primary/5 to-transparent`
  - rounded right edge, italic muted text
  - Decorative opening quote glyph. 

### 13.5 Tables (baseline)
Tables are reset and bordered inside prose:
- `.prose table, td, th { @apply border border-border; padding: 0.5rem; border-collapse: collapse; }`
- `table { width: 100%; }` 

### 13.6 KaTeX
KaTeX is slightly enlarged and display math is horizontally scrollable. 

---

## 14) Motion & interaction rules (site-wide)

### 14.1 Motion defaults
- Most hover interactions use:
  - subtle translate up (`-translate-y-*`)
  - border tint to primary
  - shadow with a very light primary-colored glow. 

### 14.2 Hero motion specifics (must match)
- Headline: fade + slide up
- Right dashboard: fade + scale in
- Carousel: timed 5s; crossfade + x-shift
- Scanning line: 10s infinite linear. 

### 14.3 Footer ambient motion
- Blob animation loops through translate + scale states. 

---

## 15) Tailwind configuration expectations

Tailwind is extended minimally and relies on CSS variables:

- `border` → `hsl(var(--border))`
- `foreground` → `hsl(var(--foreground))`
- `muted` / `muted.foreground` → variable-based
- `primary` → `hsl(var(--primary))`
- Typography plugin enabled (`@tailwindcss/typography`). 

---

## 16) Personal details removal (required)

Where the UI currently renders identity strings, replace with placeholders while keeping:
- Font class
- Case (uppercase/lowercase)
- Tracking
- Size
- Spacing

**Replace these occurrences**
- Sidebar logo name + subtitle → `<BrandName>`, `<BrandSubtitle>` (optional) 
- Mobile top banner name → `<BrandName>` 
- Footer brand name + copyright line/tagline → `<BrandName>`, `<BrandTagline>` 

---

## 17) High-fidelity reproduction checklist

### Must-match tokens
- Primary accent is **HSL(181, 100%, 28%)** in light mode, and lifted in dark mode via `+6%` lightness. 
- Base radius is `0.625rem` with derived radii tokens. 
- Selection uses `brand-200` background + `brand-900` text. 

### Must-match layout behaviors
- Sidebar: `w-64` expanded; collapses to `lg:w-20`; mobile slides in/out with overlay. 
- Desktop: floating utility navbar at `top-6 right-6` with rounded-full glass styling. 
- Mobile: bottom dock with rounded top and backdrop blur; add bottom padding/spacing so content isn’t obscured. 

### Must-match hero details
- Headline sizes/weight/leading, CTA pill shapes (`rounded-[2rem]`), dashboard card rounding (`rounded-[3rem]`), indicator widths (`w-8` active vs `w-1.5` inactive), scanning line motion. 

---

## Appendix A — Key class snippets (canonical patterns)

Use these as “golden” patterns across the app:

1) **Glassy card**
- `border border-border/40 bg-card/80 backdrop-blur-3xl shadow-2xl` 

2) **Icon button (utility)**
- `p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors` 

3) **Micro badge (mono, uppercase)**
- `text-[9px] font-bold uppercase tracking-[0.2em] local-jetbrains-mono` 

4) **Hover lift + primary glow**
- `hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5` 