# Troubleshooting Guide

Common issues and solutions for Next Notion CMS.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Development Issues](#development-issues)
- [Notion CMS Issues](#notion-cms-issues)
- [Authentication Issues](#authentication-issues)
- [Database Issues](#database-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)
- [FAQ](#faq)

---

## Installation Issues

### pnpm Install Fails

**Problem**: `pnpm install` fails with dependency errors.

**Solutions:**

```bash
# Clear cache and reinstall
rm -rf node_modules .next pnpm-lock.yaml
pnpm store prune
pnpm install

# If using Node 20+, try legacy peer deps
pnpm install --legacy-peer-deps
```

### Node Version Mismatch

**Problem**: Errors about incompatible Node version.

**Solution:**

```bash
# Check current version
node --version

# Should be v20.x or higher
# Use nvm to switch versions
nvm install 20
nvm use 20
```

### Environment Variables Not Loading

**Problem**: `.env.local` variables not being read.

**Solutions:**

1. Ensure file is named exactly `.env.local` (not `.env`)
2. Restart dev server after changes
3. Check for typos in variable names
4. Verify file is in project root

```bash
# Debug: Check if env vars are loaded
console.log(process.env.DATABASE_URL);
```

---

## Development Issues

### Port Already in Use

**Problem**: `Error: Port 3000 is already in use`

**Solutions:**

```bash
# Option 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
pnpm dev -p 3001

# Option 3: Find and kill specific process
netstat -ano | grep :3000
taskkill /PID <PID> /F  # Windows
kill -9 <PID>           # Linux/Mac
```

### Module Not Found Errors

**Problem**: `Module not found: Can't resolve '...'`

**Solutions:**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Check import paths
# Use @/ alias instead of relative paths
import { something } from '@/lib/utils'; // ✅
import { something } from '../../lib/utils'; // ❌
```

### TypeScript Errors

**Problem**: TypeScript compilation errors during development.

**Solutions:**

```bash
# Check TypeScript config
cat tsconfig.json

# Run type checking
pnpm tsc --noEmit

# Common fixes:
# 1. Install missing types
pnpm add -D @types/node @types/react

# 2. Clear TypeScript cache
rm -rf node_modules/.cache

# 3. Restart TS server in VS Code
# Command Palette > TypeScript: Restart TS Server
```

### Hot Reload Not Working

**Problem**: Changes don't reflect in browser.

**Solutions:**

1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
2. Clear browser cache
3. Check for console errors
4. Restart dev server
5. Disable any aggressive antivirus/firewall

---

## Notion CMS Issues

### "Could not find property: Status"

**Problem**: Error about missing Status property.

**Solution:**

1. Open Notion database
2. Add new property named exactly **"Status"** (case-sensitive)
3. Set property type to **Status** (not Select or Text)
4. Add options: "Draft" and "Published"
5. Wait for cache to refresh (~1 hour) or redeploy

### Content Not Appearing

**Problem**: Content created in Notion doesn't show on site.

**Checklist:**

- [ ] Status is set to "Published"
- [ ] Database is shared with integration
- [ ] Database ID is correct in `.env.local`
- [ ] Waited for cache revalidation (1 hour)
- [ ] Checked browser console for errors
- [ ] Verified NOTION_AUTH_TOKEN is valid

**Quick Fix:**

```bash
# Trigger manual revalidation by redeploying
# On Vercel: Go to Deployments > Redeploy
```

### Notion API Rate Limiting

**Problem**: `APIError: rate_limit_exceeded`

**Solutions:**

1. **Implement caching** (already built-in with 1-hour TTL)
2. **Reduce API calls** during development
3. **Use local fallback** content for testing
4. **Wait** - limits reset automatically

```typescript
// Rate limits: 3 requests/second
// Solution: React Cache + ISR handles this automatically
```

### Database Connection Failed

**Problem**: Cannot connect Notion database.

**Solution:**

1. In Notion, open database
2. Click three dots (...) top-right
3. Scroll to "Connect to"
4. Search and select your integration
5. Verify in integration settings

---

## Authentication Issues

### OAuth Callback URL Mismatch

**Problem**: `redirect_uri_mismatch` error.

**Solution:**

Ensure callback URLs in OAuth provider settings match exactly:

```
Development:
http://localhost:3000/api/auth/callback/google

Production:
https://your-domain.com/api/auth/callback/google
```

**Note**: No trailing slashes, exact protocol (http vs https).

### Session Expires Immediately

**Problem**: Users logged out immediately after login.

**Solutions:**

1. **Check BETTER_AUTH_SECRET**:
   ```bash
   # Must be consistent across restarts
   # Generate new one:
   openssl rand -base64 32
   ```

2. **Verify system clock is synchronized**

3. **Check browser cookies enabled**

4. **Clear browser cookies and retry**

### "Invalid Token" Error

**Problem**: OAuth token validation fails.

**Solutions:**

1. Regenerate OAuth credentials
2. Ensure redirect URIs match exactly
3. Check OAuth app is approved/active
4. Verify client ID and secret are correct
5. Check for extra whitespace in `.env.local`

---

## Database Issues

### Database Connection Failed

**Problem**: Cannot connect to Supabase.

**Solutions:**

1. **Verify connection string**:
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

2. **Check IP whitelist** in Supabase dashboard

3. **Test connection**:
   ```bash
   psql $DATABASE_URL
   ```

4. **Use connection pooling** (port 6543):
   ```env
   DATABASE_URL=postgresql://...:6543/postgres?pgbouncer=true
   ```

### Schema Not Applied

**Problem**: Tables missing after `db:push`.

**Solutions:**

```bash
# Check if migration ran
pnpm db:studio

# Force push schema
pnpm db:push --force

# Manually check Supabase SQL editor
# Tables should be: user, session, account, verification
```

### Drizzle Studio Won't Start

**Problem**: `pnpm db:studio` doesn't work.

**Solutions:**

```bash
# Check if port 3000 is free
lsof -ti:3000 | xargs kill -9

# Try explicit port
pnpm db:studio --port 3001

# Or access directly via browser
# http://localhost:3000
```

---

## Deployment Issues

### Build Fails on Vercel

**Problem**: Deployment fails during build.

**Solutions:**

1. **Check build logs** in Vercel dashboard
2. **Verify all environment variables** are set
3. **Test build locally**:
   ```bash
   pnpm build
   ```
4. **Check Node version** in Vercel settings (should be 20.x)
5. **Increase memory** if OOM errors (Vercel Pro)

### Environment Variables Not Working

**Problem**: Site deployed but features broken.

**Solutions:**

1. **Verify all env vars** in Vercel Settings > Environment Variables
2. **Check environment** (Production vs Preview)
3. **Redeploy** after adding variables
4. **Verify variable names** match exactly

### Custom Domain SSL Issues

**Problem**: SSL certificate not provisioning.

**Solutions:**

1. **Wait up to 24 hours** for automatic provisioning
2. **Verify DNS records** are correct:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
3. **Remove and re-add domain** in Vercel
4. **Contact Vercel support** if persists > 48 hours

### 404 on Dynamic Routes

**Problem**: Pages return 404 after deployment.

**Solutions:**

1. **Check `generateStaticParams`** implementation
2. **Verify ISR configuration**:
   ```typescript
   export const revalidate = 3600;
   ```
3. **Force regeneration**:
   - Trigger webhook
   - Manual redeploy
   - Wait for ISR revalidation

---

## Performance Issues

### Slow Page Loads

**Problem**: Pages taking too long to load.

**Solutions:**

1. **Check Lighthouse score**:
   ```bash
   # Use Chrome DevTools > Lighthouse
   ```

2. **Optimize images**:
   - Use Next.js Image component
   - Compress large images
   - Use appropriate formats (AVIF/WebP)

3. **Enable caching**:
   ```typescript
   export const revalidate = 3600;
   ```

4. **Reduce bundle size**:
   ```bash
   # Analyze bundle
   pnpm build
   npx next-bundle-analyzer
   ```

5. **Check Notion API latency**:
   - Implement proper caching
   - Use ISR

### High Memory Usage

**Problem**: Server running out of memory.

**Solutions:**

1. **Optimize image sizes**
2. **Reduce concurrent API calls**
3. **Implement pagination**
4. **Upgrade Vercel plan** if needed
5. **Profile memory usage**:
   ```bash
   node --inspect dist/server.js
   ```

### Poor Core Web Vitals

**Problem**: Low scores on CWV metrics.

**Solutions:**

| Metric | Target | Solution |
|--------|--------|----------|
| **LCP** | < 2.5s | Optimize images, use CDN |
| **FID** | < 100ms | Reduce JavaScript, code split |
| **CLS** | < 0.1 | Set image dimensions, reserve space |
| **INP** | < 200ms | Optimize event handlers |

---

## FAQ

### Q: How do I clear the cache?

**A:** 
```bash
# Development cache
rm -rf .next

# Trigger ISR revalidation
# Visit: https://your-domain.com/api/revalidate?secret=YOUR_SECRET

# Or redeploy on Vercel
```

### Q: Can I use MySQL instead of PostgreSQL?

**A:** Technically yes, but not recommended. The schema is optimized for PostgreSQL/Supabase. You'd need to modify the Drizzle schema.

### Q: How do I add a new OAuth provider?

**A:** 
1. Add provider credentials to `.env.local`
2. Update `lib/auth.ts` configuration
3. Add provider button to sign-in page
4. See [Authentication Guide](authentication.md)

### Q: Why is my content showing old data?

**A:** Content is cached for 1 hour (ISR). To update immediately:
- Redeploy on Vercel
- Wait for automatic revalidation
- Implement on-demand revalidation

### Q: How do I backup my database?

**A:** Via Supabase dashboard:
1. Go to Project Settings > Database
2. Click "Backup"
3. Download SQL dump

Or use CLI:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Q: Can I host this elsewhere besides Vercel?

**A:** Yes! Options include:
- Netlify (with adapters)
- Railway
- Render
- Self-hosted (Docker)

See [Deployment Guide](deployment.md) for alternatives.

---

## Getting More Help

If you can't find a solution here:

1. **Search existing issues**: [GitHub Issues](https://github.com/prasad-kmd/next-notion-cms/issues)
2. **Create new issue**: Include error messages and steps to reproduce
3. **Join discussions**: [GitHub Discussions](https://github.com/prasad-kmd/next-notion-cms/discussions)
4. **Check documentation**: [Full Docs](README.md)
5. **Contact author**: [Email](mailto:contact@prasadm.vercel.app)

### Useful Debug Commands

```bash
# Check environment variables
printenv | grep NEXT_

# Test database connection
pnpm db:studio

# Analyze build
pnpm build --analyze

# Check for TypeScript errors
pnpm tsc --noEmit

# Lint code
pnpm lint

# View logs (Vercel)
vercel logs
```

---

**Last Updated**: April 2025  
**Version**: 1.0.0
