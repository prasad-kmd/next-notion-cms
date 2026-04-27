# Deployment Guide

Complete guide for deploying Next Notion CMS to production.

## Table of Contents

- [Overview](#overview)
- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [Environment Variables](#environment-variables)
- [Build Configuration](#build-configuration)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Performance Optimization](#performance-optimization)
- [Monitoring](#monitoring)

---

## Overview

Next Notion CMS is optimized for deployment on **Vercel**, the platform created by the Next.js team. This guide covers:

- 🚀 One-click Vercel deployment
- ⚙️ Environment configuration
- 🔒 Security best practices
- 📊 Performance monitoring

---

## Vercel Deployment (Recommended)

### Step 1: Push to GitHub

```bash
# Commit your changes
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project settings

### Step 3: Configure Build Settings

**Framework Preset**: Next.js  
**Root Directory**: `./`  
**Build Command**: `pnpm build`  
**Output Directory**: `.next` (auto-detected)  
**Install Command**: `pnpm install`

### Step 4: Add Environment Variables

Navigate to **Settings > Environment Variables** and add all variables from your `.env.local`:

| Variable             | Environment | Value                     |
| -------------------- | ----------- | ------------------------- |
| `DATABASE_URL`       | Production  | Your Supabase URL         |
| `BETTER_AUTH_SECRET` | Production  | Your auth secret          |
| `BETTER_AUTH_URL`    | Production  | `https://your-domain.com` |
| `NOTION_AUTH_TOKEN`  | Production  | Your Notion token         |
| ...                  | ...         | ...                       |

⚠️ **Important**: Add variables for all environments (Production, Preview, Development)

### Step 5: Deploy

Click **"Deploy"** and wait for the build to complete.

---

## Environment Variables

### Production Environment Template

```env
# ===========================================
# SITE CONFIGURATION
# ===========================================
SITE_URL=https://your-domain.com
NODE_ENV=production

# ===========================================
# DATABASE & AUTHENTICATION
# ===========================================
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
BETTER_AUTH_SECRET=your_production_secret_32_chars
BETTER_AUTH_URL=https://your-domain.com

# ===========================================
# NOTION CMS
# ===========================================
NOTION_AUTH_TOKEN=secret_your_token
NOTION_BLOG_ID=your_blog_id
NOTION_ARTICLES_ID=your_articles_id
NOTION_TUTORIALS_ID=your_tutorials_id
NOTION_PROJECTS_ID=your_projects_id
NOTION_WIKI_ID=your_wiki_id
NOTION_AUTHORS_ID=your_authors_id

# ===========================================
# OAUTH PROVIDERS
# ===========================================
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# ===========================================
# EXTERNAL SERVICES
# ===========================================
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
TELEGRAM_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### Securing Secrets

Best practices:

1. ✅ Use Vercel's encrypted environment variables
2. ✅ Never commit `.env` files to Git
3. ✅ Rotate secrets periodically
4. ✅ Use different secrets per environment
5. ✅ Restrict database access by IP

---

## Build Configuration

### package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  }
}
```

### next.config.js

Ensure proper configuration for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.notion.so" },
      { protocol: "https", hostname: "**.amazonaws.com" },
    ],
  },
  // Enable static exports if needed
  // output: 'export',
};

module.exports = nextConfig;
```

---

## Post-Deployment Checklist

### Functionality Tests

- [ ] Homepage loads correctly
- [ ] All content types display (`/blog`, `/articles`, etc.)
- [ ] Individual pages render properly
- [ ] Search functionality works
- [ ] Authentication flow completes
- [ ] User dashboard accessible
- [ ] Comments system functional
- [ ] Contact form submits
- [ ] OAuth providers working

### Performance Checks

- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify image optimization
- [ ] Test mobile responsiveness
- [ ] Measure Time to First Byte (TTFB)

### SEO Verification

- [ ] Meta tags present
- [ ] Open Graph images generate
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt configured
- [ ] Schema.org markup valid

### Security Audit

- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Database credentials secure

---

## Performance Optimization

### Image Optimization

Configure in `next.config.js`:

```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200],
  imageSizes: [16, 32, 48, 64, 96],
}
```

### Caching Strategy

- **ISR**: 1-hour revalidation for content
- **Static Assets**: Long-term caching via Vercel
- **API Routes**: React cache + unstable_cache

### Code Splitting

Automatic with Next.js:

- Page-level code splitting
- Dynamic imports for heavy components
- Lazy loading for syntax highlighting

---

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard:

- **Web Analytics**: Traffic insights
- **Speed Insights**: Performance metrics
- **Real Experience Score**: User-centric metrics

### Error Tracking

Recommended tools:

- **Sentry**: Error reporting
- **LogRocket**: Session replay
- **Vercel Logs**: Server logs

### Uptime Monitoring

Set up external monitoring:

- **UptimeRobot**: Free tier available
- **Pingdom**: Advanced features
- **StatusCake**: Comprehensive alerts

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to **Project Settings > Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### Step 2: Configure DNS

**For Root Domain:**

```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain:**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: SSL Certificate

Vercel automatically provisions SSL certificates. No action required.

---

## Rollback Strategy

### Quick Rollback

If issues arise:

1. Go to **Vercel Dashboard > Deployments**
2. Find previous stable deployment
3. Click **"Promote to Production"**

### Database Rollback

For schema issues:

```bash
# Keep migration history
pnpm drizzle-kit generate

# Review SQL before applying
# Manually revert in Supabase SQL Editor if needed
```

---

## Related Documentation

- [Getting Started](getting-started.md) - Initial setup
- [Configuration](configuration.md) - All config options
- [Troubleshooting](troubleshooting.md) - Common issues
- [Architecture](architecture.md) - System design
