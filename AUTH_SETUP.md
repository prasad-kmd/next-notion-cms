# Authentication & Database Setup Guide

This guide provides step-by-step instructions for setting up **Better Auth**, **Supabase**, and **Drizzle ORM** for your Engineering Workspace.

## 1. Supabase Setup (Database)

1.  **Create a Project:** Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Get Connection String:**
    *   Navigate to **Project Settings** > **Database**.
    *   Copy the **URI** connection string (ensure it includes your password).
    *   Add this to your `.env.local` as `DATABASE_URL`.
    *   *Tip:* If using Supabase Connection Pooling (IPv4), use the Transaction mode URI (port 6543).

## 2. Better Auth Configuration

1.  **Generate Secret:**
    *   Run `npx auth secret` or `openssl rand -base64 32`.
    *   Add the output to `.env.local` as `BETTER_AUTH_SECRET`.
2.  **Set Base URL:**
    *   Add `BETTER_AUTH_URL=http://localhost:3000` (for development) or your production URL.

## 3. OAuth Provider Setup

### Google
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Go to **APIs & Services** > **Credentials**.
4.  Create an **OAuth 2.0 Client ID** (Web Application).
5.  Add Authorized Redirect URIs:
    *   `http://localhost:3000/api/auth/callback/google`
    *   `https://your-domain.com/api/auth/callback/google`
6.  Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env.local`.

### GitHub
1.  Go to **GitHub Settings** > **Developer settings** > **OAuth Apps**.
2.  Register a new application.
3.  Set the **Homepage URL** to your site URL.
4.  Set the **Authorization callback URL**:
    *   `http://localhost:3000/api/auth/callback/github`
    *   `https://your-domain.com/api/auth/callback/github`
5.  Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to `.env.local`.

## 4. Drizzle Migrations

Once your `DATABASE_URL` is set, you need to push the schema to Supabase:

```bash
# Push the schema directly to the database
pnpm db:push

# Or generate and run migrations manually
pnpm drizzle-kit generate
# Then run the SQL in your database dashboard
```

## 5. Summary of Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true

# Better Auth
BETTER_AUTH_SECRET=your_32_char_secret
BETTER_AUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## 6. How it Works

*   **Stateless Sessions:** Uses JWT strategy to reduce database lookups on every request, staying within Supabase's free tier quotas.
*   **Auto-Sync:** Upon sign-in, the `useAuthSync` hook detects local bookmarks/preferences and merges them into the `user.preferences` JSONB column in the database.
*   **Account Linking:** Better Auth is configured to automatically link accounts with the same email across different providers.

## 7. Role-Based Access Control (RBAC)

The system supports `user` and `admin` roles. By default, all new users are assigned the `user` role.

### Designating an Admin
Currently, admin designation is a manual process via the database.

1.  Connect to your Supabase SQL Editor.
2.  Identify the user's email you want to promote.
3.  Run the following SQL:
    ```sql
    UPDATE "user" SET role = 'admin' WHERE email = 'target@example.com';
    ```
4.  The change will take effect on the user's next session refresh or re-authentication.

### Protecting Routes
Route protection is managed in `proxy.ts` (Next.js 16 Middleware replacement).

To protect a new route, add it to the `PROTECTED_ROUTES` array in `proxy.ts`:
```typescript
const PROTECTED_ROUTES = [
    { path: "/roadmap", exact: true, role: "admin" },
    { path: "/new-protected-page", pattern: "/new-protected-page/*", role: "admin" },
];
```

### Authorization Utilities
*   **Server Side:** Use `requireAdmin()` in server components to block access.
*   **Client Side:** Use `useIsAdmin()` hook or the `<AdminOnly>` component.
