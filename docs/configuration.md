# Configuration Guide

This document covers all configuration options available in Next Notion CMS.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Site Configuration](#site-configuration)
- [Content Configuration](#content-configuration)
- [Notion Configuration](#notion-configuration)
- [Database Configuration](#database-configuration)
- [OAuth Providers](#oauth-providers)

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `BETTER_AUTH_SECRET` | 32-character random secret | Generated via `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Base URL for auth | `http://localhost:3000` |

### Optional Variables

#### Notion CMS

| Variable | Description | Default |
|----------|-------------|---------|
| `NOTION_AUTH_TOKEN` | Notion integration token | - |
| `NOTION_BLOG_ID` | Blog database ID | - |
| `NOTION_ARTICLES_ID` | Articles database ID | - |
| `NOTION_TUTORIALS_ID` | Tutorials database ID | - |
| `NOTION_PROJECTS_ID` | Projects database ID | - |
| `NOTION_WIKI_ID` | Wiki database ID | - |
| `NOTION_AUTHORS_ID` | Authors database ID | - |

#### External Services

| Variable | Description | Purpose |
|----------|-------------|---------|
| `TELEGRAM_TOKEN` | Telegram bot token | Contact form notifications |
| `TELEGRAM_CHAT_ID` | Telegram chat ID | Where to send notifications |
| `NEXT_PUBLIC_GITHUB_TOKEN` | GitHub PAT | Repository display |
| `NEXT_PUBLIC_GITHUB_USERNAME` | GitHub username | Your GitHub profile |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare site key | Comment protection |
| `TURNSTILE_SECRET_KEY` | Cloudflare secret key | Comment protection |

See [Authentication Guide](authentication.md) for OAuth provider variables.

---

## Site Configuration

Edit `lib/config.ts` to customize site-wide settings:

```typescript
export const siteConfig = {
  name: "Your Site Name",
  description: "Site description for SEO",
  url: "https://your-domain.com",
  ogImage: "https://your-domain.com/og.jpg",
  links: {
    twitter: "https://twitter.com/yourhandle",
    github: "https://github.com/yourusername",
  },
};
```

---

## Content Configuration

### Reading Time Calculation

Configure words per minute in `lib/constants.ts`:

```typescript
export const contentConfig = {
  wordsPerMinute: 200, // Adjust based on your audience
};
```

### Notion Revalidation

Set cache revalidation time (in seconds):

```typescript
export const notionConfig = {
  revalidate: 3600, // 1 hour - optimized for Vercel Hobby plan
};
```

---

## Notion Configuration

### Database Schema Requirements

Each Notion database must have these properties:

| Property | Type | Required |
|----------|------|----------|
| Name/Title | Title | ✅ |
| Slug | Text | ✅ |
| Date | Date | ✅ |
| Status | Select | ✅ |
| Description | Text | ✅ |
| Tags | Multi-select | ❌ |
| Categories | Select | ❌ |
| Authors | Relation | ❌ |
| AIAssisted | Checkbox | ❌ |
| Technical | Multi-select | ❌ |

See [Notion Setup Guide](notion-setup.md) for detailed instructions.

---

## Database Configuration

### Supabase Connection String Format

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

### Connection Pooling (Recommended)

For better performance with serverless functions:

```
postgresql://[USER]:[PASSWORD]@[HOST]:6543/[DATABASE]?pgbouncer=true
```

### Drizzle Schema

The database schema is defined in `lib/db/schema.ts`:

- **user**: User accounts and preferences
- **session**: Active user sessions
- **account**: Linked OAuth accounts
- **verification**: Email verification tokens

---

## OAuth Providers

### Google OAuth

```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://your-domain.com/api/auth/callback/google`

### GitHub OAuth

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

**Setup Steps:**
1. Go to GitHub Settings > Developer settings
2. Register new OAuth App
3. Set callback URL: `https://your-domain.com/api/auth/callback/github`

### Other Providers

Supported providers with their environment variables:

| Provider | Client ID Var | Client Secret Var |
|----------|--------------|-------------------|
| Facebook | `FACEBOOK_CLIENT_ID` | `FACEBOOK_CLIENT_SECRET` |
| Twitter | `TWITTER_CLIENT_ID` | `TWITTER_CLIENT_SECRET` |
| Reddit | `REDDIT_CLIENT_ID` | `REDDIT_CLIENT_SECRET` |
| Notion | `NOTION_CLIENT_ID` | `NOTION_CLIENT_SECRET` |
| Vercel | `VERCEL_CLIENT_ID` | `VERCEL_CLIENT_SECRET` |

See [Authentication Guide](authentication.md) for detailed setup instructions.

---

## Related Documentation

- [Getting Started](getting-started.md) - Initial setup guide
- [Authentication](authentication.md) - OAuth and auth configuration
- [Deployment](deployment.md) - Production configuration
- [Troubleshooting](troubleshooting.md) - Common configuration issues
