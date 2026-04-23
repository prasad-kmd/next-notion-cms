# PostHog Analytics Integration

This document provides complete instructions for setting up and configuring PostHog analytics for your Engineering Workspace.

## Overview

We use PostHog for both client-side user tracking and a custom server-side admin dashboard.
- **Client-side:** Automatically captures pageviews and interactions.
- **Enhanced Tracking:** Specific components track content views with rich metadata (content type, slug, author).
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

## 6. Page View Tracking

The system implements individual page view tracking for all content types (Blog, Articles, Tutorials, Projects, and Wiki).

### How it works:
1.  **PageViewTracker:** A client component placed on content pages that captures a `$pageview` event with custom properties: `content_type`, `page_slug`, `page_title`, and `author_id`.
2.  **ViewCounter:** A client component that fetches the total view count for a specific slug from our internal API (`/api/views/[slug]`).
3.  **API Proxy:** The view count API queries PostHog's Trend API to get aggregated totals, with built-in caching (1 hour) to ensure performance.

---

## 7. Enhanced Event Tracking

The system tracks several custom events to provide deeper insights:

### 7.1 Comments and Interactions
- `comment_submitted`: Captured when a user successfully posts a comment.
  - Properties: `page_id`, `content_length`, `author_id`.
- `bookmark_added` / `bookmark_removed`: Captured when users manage their saved content.
  - Properties: `post_slug`, `post_title`, `content_type`.
- `bookmark_synced`: Captured when local bookmarks are synchronized with the user's account.

### 7.2 Outbound Links
- `outgoing_link_clicked`: Captured via the `SafeLink` component and `ContentRenderer`.
  - Properties: `target_domain`, `link_url`, `source_page`.

---

## 8. Recharts Dashboard Features

The Admin Analytics Dashboard at `/dashboard/analytics` has been enhanced with Recharts visualizations:

- **Summary Metrics:** Key performance indicators including unique visitors, average views per post, and total interaction counts.
- **Traffic Trends:** Area charts with smooth interpolation showing pageview growth.
- **Breakdowns:**
  - **Sources:** Referrer-based breakdown (Direct, Google, GitHub, etc.).
  - **Geo:** Top 10 countries by traffic volume.
  - **Technical:** Device, Browser, and OS distribution using pie and bar charts.
- **Outbound Link Analysis:** Tracking which external domains your users are interested in.
- **Multi-Variable Analysis:** Stacked area charts showing traffic composition over time (e.g., by content type).

---

## 9. Troubleshooting

- **No data in dashboard:** Ensure `POSTHOG_PERSONAL_API_KEY` and `POSTHOG_PROJECT_ID` are correct. Check server logs for API errors.
- **Events not appearing:** Check the browser console for CSP (Content Security Policy) errors or network failures.
- **Charts not loading:** Ensure you have the `admin` role and that the PostHog project has enough data to generate trends.
