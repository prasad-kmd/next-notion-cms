# Architecture Overview

Deep dive into the technical architecture and design decisions of Next Notion CMS.

## Table of Contents

- [System Architecture](#system-architecture)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Caching Strategy](#caching-strategy)
- [Security Architecture](#security-architecture)
- [Scalability Considerations](#scalability-considerations)
- [Performance Optimizations](#performance-optimizations)

---

## System Architecture

### High-Level Overview

Next Notion CMS follows a **JAMstack-inspired architecture** with server-side rendering capabilities, combining the best of static generation and dynamic content delivery.

```mermaid
graph TB
    subgraph "User Layer"
        A[Desktop Browser]
        B[Mobile Browser]
        C[Tablet Browser]
    end
    
    subgraph "CDN Layer"
        D[Vercel Edge Network]
    end
    
    subgraph "Application Layer"
        E[Next.js 16 App Router]
        F[React Server Components]
        G[API Routes]
    end
    
    subgraph "Data Layer"
        H[Notion API]
        I[Supabase PostgreSQL]
        J[Local File System]
        K[External APIs]
    end
    
    A & B & C -->|HTTPS Requests| D
    D -->|Route Matching| E
    E --> F
    E --> G
    F -->|Content Fetch| H
    F -->|User Data| I
    F -->|Fallback Content| J
    G -->|Webhooks| K
    
    style D fill:#f0e6ff
    style E fill:#e6f3ff
    style H fill:#e8f5e9
    style I fill:#fce4ec
```

### Architectural Principles

1. **Server Components First**: Maximize server-side rendering for better performance and SEO
2. **Progressive Enhancement**: Core functionality works without JavaScript
3. **Edge-Optimized**: Minimize latency through edge deployment
4. **Type Safety**: End-to-end TypeScript for reliability
5. **Separation of Concerns**: Clear boundaries between layers

---

## Component Architecture

### Directory Structure

```
components/
├── ui/                    # Base UI components (buttons, inputs, etc.)
├── auth/                  # Authentication-related components
├── comments/              # Comment system components
├── dashboard/             # Dashboard widgets and layouts
├── quiz-library/          # Quiz interactive components
├── analytics/             # Analytics tracking components
├── layout.tsx             # Main layout wrapper
├── navigation.tsx         # Top navigation bar
├── footer.tsx             # Site footer
├── search.tsx             # Global search modal
├── toc.tsx                # Table of contents
└── content-renderer.tsx   # Markdown/HTML renderer
```

### Component Hierarchy

```mermaid
graph TD
    Root[Root Layout] --> Nav[Floating Navbar]
    Root --> Main[Main Content]
    Root --> Foot[Footer]
    
    Main --> Hero[Featured Hero]
    Main --> Content[Content Area]
    Main --> Sidebar[Article Sidebar]
    
    Content --> CardGrid[Content Cards]
    Content --> Renderer[Content Renderer]
    
    CardGrid --> BlogCard[Blog Card]
    CardGrid --> ArticleCard[Article Card]
    CardGrid --> ProjectCard[Project Card]
    
    Renderer --> CodeBlock[Code Block]
    Renderer --> MathBlock[Math Block]
    Renderer --> QuizBlock[Quiz Block]
    Renderer --> AlertBlock[Alert Block]
    
    style Root fill:#e3f2fd
    style Renderer fill:#fff3e0
    style CardGrid fill:#f3e5f5
```

### Key Components

#### ContentRenderer

The heart of the content display system, responsible for:

- Parsing Markdown/HTML from Notion or local files
- Injecting syntax highlighting via Shiki
- Rendering LaTeX math via KaTeX
- Embedding interactive quizzes
- Processing GitHub-style alerts
- Generating table of contents

```typescript
// Simplified example
interface ContentRendererProps {
  content: string;
  enableToc?: boolean;
  enableQuiz?: boolean;
  enableMath?: boolean;
}

export function ContentRenderer({ 
  content, 
  enableToc = true,
  enableQuiz = true,
  enableMath = true 
}: ContentRendererProps) {
  // Processing pipeline
  const processed = processContent(content, {
    syntaxHighlight: true,
    mathSupport: enableMath,
    quizSupport: enableQuiz,
  });
  
  return <div dangerouslySetInnerHTML={{ __html: processed }} />;
}
```

#### FeaturedHero

A high-performance hero section featuring:

- GSAP-powered carousel animations
- Timed rotation of featured content
- Geometric grid background
- Engineering dashboard aesthetic

---

## Data Flow

### Content Fetching Pipeline

```mermaid
sequenceDiagram
    participant C as Client
    participant N as Next.js Server
    participant R as React Cache
    participant O as Notion API
    participant L as Local FS
    participant D as Database
    
    C->>N: Request Page
    N->>R: Check Cache
    alt Cache Hit
        R-->>N: Return Cached Content
    else Cache Miss
        N->>O: Fetch from Notion
        opt Notion Unavailable
            N->>L: Fallback to Local
            L-->>N: Return Markdown
        end
        O-->>N: Return Blocks
        N->>N: Transform to HTML
        N->>R: Cache Result
    end
    N->>D: Fetch Metadata
    D-->>N: Return Metadata
    N-->>C: Render Page
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Auth Component
    participant S as Auth Server
    participant P as OAuth Provider
    participant D as Database
    
    U->>A: Click Sign In
    A->>S: Request OAuth URL
    S->>P: Redirect User
    P->>U: Show Login
    U->>P: Authenticate
    P->>S: Callback with Code
    S->>P: Exchange for Token
    S->>D: Create/Update User
    D-->>S: User Record
    S->>U: Set Session Cookie
    U->>A: Access Protected Route
    A->>S: Validate Session
    S-->>A: Valid
```

---

## Caching Strategy

### Multi-Layer Caching

| Layer | Technology | TTL | Invalidation |
|-------|-----------|-----|--------------|
| **Browser** | HTTP Cache | 1 year | Cache-Control headers |
| **CDN** | Vercel Edge | 1 year | Deploy-triggered |
| **ISR** | Next.js | 1 hour | Time-based |
| **Memory** | React Cache | Request | Request lifecycle |
| **Database** | Supabase | Configurable | Manual |

### ISR Implementation

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // 1 hour

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  // ...
}
```

### Cache Keys

Cache keys are structured for optimal invalidation:

```
notion:blog:{database_id}:{page_id}
notion:articles:{database_id}:{page_id}
user:profile:{user_id}
auth:session:{session_token}
```

---

## Security Architecture

### Defense in Depth

```mermaid
graph TB
    subgraph "Perimeter Security"
        A[DDoS Protection - Vercel]
        B[WAF - Cloudflare]
        C[Rate Limiting]
    end
    
    subgraph "Application Security"
        D[CSP Headers]
        E[XSS Prevention]
        F[CSRF Tokens]
        G[Input Validation - Zod]
    end
    
    subgraph "Authentication"
        H[JWT Tokens]
        I[HTTP-only Cookies]
        J[Session Management]
        K[OAuth Security]
    end
    
    subgraph "Data Security"
        L[SQL Injection Prevention]
        M[Environment Variables]
        N[Encryption at Rest]
        O[SSL/TLS]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O
```

### Security Headers

```typescript
// next.config.mjs
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'Content-Security-Policy',
    value: cspPolicy
  },
  // ... more headers
];
```

---

## Scalability Considerations

### Horizontal Scaling

- **Stateless Design**: Any server can handle any request
- **Session Storage**: JWT tokens eliminate server-side session storage
- **Database Pooling**: Supabase connection pooling for efficiency

### Vertical Scaling

- **Edge Functions**: Compute-heavy tasks at the edge
- **Server Components**: Reduce client bundle size
- **Image Optimization**: Offload to Vercel Image Optimization

### Bottleneck Analysis

| Potential Bottleneck | Solution |
|---------------------|----------|
| Notion API Rate Limits | React Cache + ISR |
| Database Connections | Connection Pooling |
| Large Images | Next.js Image Optimization |
| Bundle Size | Code Splitting + Tree Shaking |
| Cold Starts | Vercel Pro / Regional Deployment |

---

## Performance Optimizations

### Rendering Optimizations

1. **React Server Components**: Zero bundle size for server components
2. **Streaming SSR**: Progressive page loading
3. **Selective Hydration**: Hydrate visible content first
4. **Concurrent Features**: UseTransition, useDeferredValue

### Asset Optimizations

1. **Image Formats**: AVIF > WebP > JPEG fallback
2. **Font Loading**: `font-display: swap` with preload
3. **CSS Purging**: Tailwind removes unused styles
4. **JavaScript Bundling**: Automatic code splitting

### Network Optimizations

1. **HTTP/2**: Multiplexed requests
2. **Early Hints**: Preload critical assets
3. **Service Worker**: Offline support + caching
4. **Prefetching**: Intelligent link prefetching

### Metrics Targets

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Score | 95+ | 95-100 |
| First Contentful Paint | < 1.0s | ~0.8s |
| Largest Contentful Paint | < 2.5s | ~1.5s |
| Time to Interactive | < 3.0s | ~2.0s |
| Cumulative Layout Shift | < 0.1 | < 0.05 |
| Total Blocking Time | < 200ms | ~100ms |

---

## Related Documentation

- [Getting Started](getting-started.md) - Setup guide
- [Deployment](deployment.md) - Production deployment
- [Components](components.md) - Component reference
- [Security](../SECURITY.md) - Security policy

---

**Last Updated**: April 2025  
**Version**: 1.0.0
