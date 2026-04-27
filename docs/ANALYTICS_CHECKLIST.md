## Post-Implementation Setup Checklist

### 1. PostHog Account

- [ ] Create PostHog Cloud account at [posthog.com](https://posthog.com)
- [ ] Create a new project
- [ ] Note the **Project API Key** (Settings > Project API Key)
- [ ] Generate a **Personal API Key** (Account > Personal API Keys)
- [ ] Note the **Project ID** from the URL (`/project/ID`)

### 2. Environment Variables

- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` to `.env.local`
- [ ] Add `NEXT_PUBLIC_POSTHOG_HOST` to `.env.local` (default: `https://us.i.posthog.com`)
- [ ] Add `POSTHOG_PERSONAL_API_KEY` to `.env.local`
- [ ] Add `POSTHOG_PROJECT_ID` to `.env.local`
- [ ] Add `POSTHOG_API_HOST` to `.env.local` (default: `https://us.posthog.com`)
- [ ] Add all variables to production (e.g., Vercel)

### 3. Admin User Setup

- [ ] Sign in to your site at least once to create your user record
- [ ] Run SQL in Supabase to set your user as admin:
  ```sql
  UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';
  ```
- [ ] Refresh your site and verify the **Analytics** link appears in the user menu

### 4. Verification

- [ ] Check browser console: "PostHog initialized" (if logging enabled)
- [ ] Check PostHog **Live Events**: Pageviews should appear
- [ ] Visit `/dashboard/analytics` as admin: Graphs should load (might take a few minutes for first data)

### 5. Page View Tracking Setup

- [ ] Verify PostHog initialized with `defaults: '2026-01-30'`
- [ ] Add PageViewTracker component to content layouts
- [ ] Verify pageview events include content_type and page_slug

### 6. View Counter Setup

- [ ] Create view count API endpoint
- [ ] Add ViewCounter component to content page headers
- [ ] Verify view counts display correctly
- [ ] Test caching behavior

### 7. Top Content Analytics

- [ ] Extend analytics API with top_content insight
- [ ] Add TopContentChart to analytics dashboard
- [ ] Add TopContentTable to analytics dashboard
- [ ] Verify filtering and navigation work
