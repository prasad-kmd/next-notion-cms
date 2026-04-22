# PostHog Analytics Integration

This document provides complete instructions for setting up and configuring PostHog analytics for your Engineering Workspace.

## Overview

We use PostHog for both client-side user tracking and a custom server-side admin dashboard.
- **Client-side:** Automatically captures pageviews and interactions.
- **Admin Dashboard:** Uses PostHog's REST API to display insights directly in your site's dashboard.

---

## 1. PostHog Account Setup

1.  **Sign Up:** Create a free account at [posthog.com](https://posthog.com).
2.  **Create Project:** Create a new project (e.g., "Engineering Workspace").
3.  **Find Project API Key:** 
    - Go to **Project Settings** > **Project API Key**.
    - This is used for client-side tracking (Public).
4.  **Find Project ID:**
    - Look at your browser URL when in your project. It looks like `https://us.posthog.com/project/12345`.
    - `12345` is your Project ID.
5.  **Generate Personal API Key:**
    - Go to **Account Settings** (bottom left) > **Personal API Keys**.
    - Click **+ Create personal API key**.
    - Give it a name like "Admin Dashboard Access".
    - **Save this key immediately**; you won't see it again.

---

## 2. Environment Variables

Add the following to your `.env.local` (for development) and your production environment variables (e.g., Vercel):

```env
# Client-side configuration (Public)
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_api_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Admin Dashboard API Access (Private)
POSTHOG_PERSONAL_API_KEY=phx_your_personal_api_key_here
POSTHOG_PROJECT_ID=your_project_id_here
POSTHOG_API_HOST=https://us.posthog.com
```

> **Note:** The `NEXT_PUBLIC_` prefix is required for variables used in the browser. The personal API key and project ID are kept private to the server.

---

## 3. Local Development

1.  Install dependencies (if you haven't already):
    ```bash
    pnpm add posthog-js posthog-node
    ```
2.  Restart your development server.
3.  Open your site and check the browser console. You should see PostHog initializing.
4.  Check the **Live Events** tab in PostHog to see events coming in.

---

## 4. Admin Role & Analytics Dashboard

Only users with the `admin` role can view the analytics dashboard at `/dashboard/analytics`.

### How to set yourself as an Admin:
If you are using Supabase, run this SQL in the Query Editor:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';
```

Once updated, you will see an "Analytics" link in your user menu dropdown.

---

## 5. Reverse Proxy (Ingestion)

To prevent ad-blockers from blocking analytics, we have configured a reverse proxy in `next.config.mjs`. All PostHog requests are sent to `/ingest/*` on your own domain and then proxied to PostHog.

---

## 6. Troubleshooting

- **No data in dashboard:** Ensure `POSTHOG_PERSONAL_API_KEY` and `POSTHOG_PROJECT_ID` are correct. Check server logs for API errors.
- **Events not appearing:** Check the browser console for CSP (Content Security Policy) errors or network failures.
- **Charts not loading:** Ensure you have the `admin` role and that the PostHog project has enough data to generate trends.
