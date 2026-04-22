# Authentication Guide

Comprehensive guide to setting up and managing authentication in Next Notion CMS.

## Table of Contents

- [Overview](#overview)
- [Better Auth Setup](#better-auth-setup)
- [OAuth Provider Configuration](#oauth-provider-configuration)
- [Database Setup](#database-setup)
- [User Dashboard](#user-dashboard)
- [Role-Based Access Control](#role-based-access-control)
- [Security Features](#security-features)

---

## Overview

Next Notion CMS uses **Better Auth** with **Supabase** (PostgreSQL) for authentication, providing:

- 🔐 Stateless JWT sessions
- 🔗 Multi-provider OAuth with auto-linking
- 👤 User dashboard with preference sync
- 🛡️ Role-based access control (RBAC)

---

## Better Auth Setup

### Step 1: Generate Auth Secret

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: npx
npx auth secret
```

### Step 2: Configure Environment

```env
BETTER_AUTH_SECRET=your_32_character_secret_here
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@host:5432/database
```

### Step 3: Push Database Schema

```bash
pnpm db:push
```

This creates the required tables:
- `user` - User accounts
- `session` - Active sessions
- `account` - Linked OAuth accounts
- `verification` - Email verification tokens

---

## OAuth Provider Configuration

### Google OAuth

#### Setup Steps

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.com/api/auth/callback/google
   ```
7. Copy Client ID and Client Secret

#### Environment Variables

```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

### GitHub OAuth

#### Setup Steps

1. Go to **GitHub Settings > Developer settings > OAuth Apps**
2. Click **New OAuth App**
3. Fill in application details:
   - **Application name**: Your site name
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: 
     ```
     http://localhost:3000/api/auth/callback/github
     https://your-domain.com/api/auth/callback/github
     ```
4. Register application
5. Generate new client secret

#### Environment Variables

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### Other Providers

| Provider | Setup Link | Callback URL Format |
|----------|-----------|---------------------|
| Facebook | [Meta Dev](https://developers.facebook.com/) | `/api/auth/callback/facebook` |
| Twitter | [Twitter Dev](https://developer.twitter.com/) | `/api/auth/callback/twitter` |
| Reddit | [Reddit Apps](https://www.reddit.com/prefs/apps) | `/api/auth/callback/reddit` |
| Notion | [Notion Integrations](https://www.notion.so/my-integrations) | `/api/auth/callback/notion` |
| Vercel | [Vercel Integrations](https://vercel.com/integrations) | `/api/auth/callback/vercel` |

---

## Database Setup

### Supabase Configuration

1. **Create Project**: Go to [Supabase](https://supabase.com/)
2. **Get Connection String**: 
   - Project Settings > Database
   - Copy URI connection string
3. **Configure Pooling** (Recommended):
   - Use port 6543 for transaction mode
   - Add `?pgbouncer=true` to connection string

### Connection String Format

```
# Standard Connection
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# With Connection Pooling
postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
```

---

## User Dashboard

### Features

The user dashboard (`/dashboard`) provides:

- 👤 **Profile Management**: View and edit profile information
- 🔗 **Account Connections**: Link/unlink OAuth providers
- ⚙️ **Preferences**: Manage UI preferences
- 🔖 **Bookmarks**: Saved content management
- 📊 **Activity**: Recent activity overview

### Smart Preferences Sync

When users log in:

1. Local bookmarks detected
2. Preferences compared with database
3. Intelligent merge performed
4. Database updated with latest data

This ensures seamless experience across devices.

---

## Role-Based Access Control

### Default Roles

- **user** (default): Standard user access
- **admin**: Administrative privileges

### Designating an Admin

Execute SQL in Supabase SQL Editor:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'target@example.com';
```

### Protecting Routes

Routes are protected via middleware in `proxy.ts`:

```typescript
const PROTECTED_ROUTES = [
    { path: "/dashboard", exact: false, role: "user" },
    { path: "/admin", exact: false, role: "admin" },
];
```

### Server-Side Protection

Use in server components:

```typescript
import { requireAdmin } from '@/lib/auth-utils';

export default async function AdminPage() {
  await requireAdmin();
  // Admin-only content
}
```

### Client-Side Protection

Use hooks or components:

```tsx
// Hook approach
const isAdmin = useIsAdmin();

// Component approach
<AdminOnly>
  <AdminContent />
</AdminOnly>
```

---

## Security Features

### Stateless Sessions

- JWT-based authentication
- No database lookup on every request
- Optimized for serverless environments

### Account Linking

Automatic account linking when:
- Same email address
- Different OAuth providers
- Merges accounts seamlessly

### Session Management

- Automatic expiration handling
- Refresh token rotation
- IP address tracking
- User agent logging

### Rate Limiting

Built-in rate limiting on:
- Login attempts
- Password reset requests
- API endpoints

---

## Troubleshooting

### "Invalid Callback URL"

Ensure your callback URLs exactly match:
- Protocol (http vs https)
- Domain (localhost vs production)
- Path (no trailing slashes)

### "Session Expired Immediately"

Check:
- `BETTER_AUTH_SECRET` is consistent
- System clock is synchronized
- Browser cookies are enabled

### "OAuth Provider Not Working"

Verify:
- Client ID and Secret are correct
- Redirect URIs match exactly
- Provider app is approved/active

---

## Related Documentation

- [Getting Started](getting-started.md) - Initial setup
- [Configuration](configuration.md) - All config options
- [Database Guide](database.md) - Supabase setup
- [Deployment](deployment.md) - Production deployment