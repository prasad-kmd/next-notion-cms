# Notion CMS Migration Instructions

This document provides comprehensive, step-by-step instructions for completing the migration from a Git-based CMS to a Notion-based CMS.

## **1. Notion Setup**

### **A. Create a Notion Integration**
1. Go to [Notion - My Integrations](https://www.notion.so/my-integrations).
2. Click **"+ New integration"**.
3. Set the name (e.g., "Engineering Blogfolio CMS") and select the workspace.
4. Keep the default capabilities (Read, Update, and Insert content; No user information needed).
5. Click **Submit** to create the integration.
6. Copy the **Internal Integration Token**. This will be your `NOTION_AUTH_TOKEN`.

### **B. Set up Databases**
You need to create five databases in Notion for: **Blog**, **Articles**, **Tutorials**, **Projects**, and **Wiki** and **Authors**.

#### **Database Schema**
Each database (except **Authors**) should have the following properties:

- For `/blog`,`/articles`,`/projects`,`/tutorials` and `/wiki`

| Property Name | Property Type | Description |
| :--- | :--- | :--- |
| **Name** (or **Title**) | Title | The display name of the content item (automatically detected). |
| **Slug** | Text | The URL slug (e.g., `my-awesome-post`). |
| **Authors** | Relation | This has relation with `Authors` database. |
| **Date** | Date | Publication date. |
| **Status** | Select | [Published, Draft ] Set to `Published` for the item to appear on the site. |
| **Description** | Text | A brief summary for the card view. |
| **Tags** | Multi-select | Keywords for filtering. |
| **Categories** | Select | Main category (used for quizzes and organization). |
| **AIAssisted** | Checkbox | (Optional) Show an indicator if AI was used. |
| **Technical** | Multi-Select | (Optional) Tech stack or technical details. |

For **Authors** Database,

- For `/authors` and `/authors/[slug]/`

| Property Name | Property Type | Description |
| :--- | :--- | :--- |
| **Name** (or **Title**) | Title | The display name of the content item (automatically detected). |
| **Slug** | Text | The URL slug (e.g., `my-awesome-post`). |
| **Role** | Text | Role of the author. |
| **Biography** | Text | A Short Biography info |
| **avatar** | Files and Media | A photo for Author avatar. |
| **twitter** | Text | twitter username of the author. |
| **GitHub** | Text | GitHub username of the author. |
| **linkedin** | Text | linkedin username of the author. |
| **Status** | Select | [Published, Draft ] Set to `Published` for the item to appear on the site. |

#### **Sharing Databases with the Integration**
For **each** database created:
1. Open the database in Notion.
2. Click the three dots **(...)** in the top right corner.
3. Scroll down to **"Connect to"**.
4. Search for your integration name and select it.

### **C. Obtain Database IDs**
For each database, the ID is the part of the URL after the workspace name and before the `?v=...` part.
- URL format: `https://www.notion.so/myworkspace/DATABASE_ID?v=...`
- Copy these IDs for each of the six content types.

---

## **2. Environment Variables**

Add the following variables to your `.env.local` file (for local development) and to your Vercel project dashboard:

```env
NOTION_AUTH_TOKEN=secret_your_token_here
NOTION_BLOG_ID=your_blog_database_id
NOTION_ARTICLES_ID=your_articles_database_id
NOTION_TUTORIALS_ID=your_tutorials_database_id
NOTION_PROJECTS_ID=your_projects_database_id
NOTION_WIKI_ID=your_wiki_database_id
NOTION_AUTHORS_ID=your_authors_database_id
```

---

## **3. Implementation Details**

- **Data Fetching:** The site now uses `@notionhq/client` to fetch content.
- **Markdown Conversion:** We use `notion-to-md` to convert Notion blocks into Markdown, which is then rendered using the existing `marked` setup.
- **Caching & ISR (Optimized for Vercel Hobby Plan):**
    - **Server Cache:** Notion API responses are cached for **1 hour (3600s)** using Next.js `unstable_cache`.
    - **ISR:** All content pages are configured with **Incremental Static Regeneration (ISR)** set to **1 hour** (`export const revalidate = 3600`). This is done to stay within the ISR Read/Write limits of the Vercel Hobby plan.
    - **On-Demand Rendering:** The site is configured with `dynamicParams = true`, meaning new pages added to Notion will be generated on-the-fly when first visited.
    - **What this means:**
        - **Updates:** When you update content in Notion, the changes will appear on the live site within approximately **1 hour** (after the next visitor triggers a revalidation).
        - **New Pages:** When you add a new page to Notion, it becomes available immediately via its URL, and will appear in the listing pages (like `/blog`) after the 1-hour cache expires and the page revalidates.
        - **Immediate Update:** If you need an update to appear immediately, you can trigger a manual redeployment in the Vercel dashboard.
- **Fallback:** If a Notion Database ID is missing or the API call fails, the system is designed to gracefully fall back to reading files from the `content/` directory.

---

## **4. Deployment & Verification**

### **Vercel Deployment**
1. Push the code changes to your repository.
2. Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard).
3. Navigate to **Settings > Environment Variables**.
4. Add all the environment variables listed in Section 2.
5. Trigger a new deployment.

### **Verification**
1. Visit the deployed site.
2. Check `/blog`, `/articles`, `/tutorials`, `/projects`, and `/wiki`.
3. Ensure that items marked as "Published" in Notion appear on the site.
4. Verify that formatting (images, code blocks, math) is preserved.

---

## **5. Rollback**

If you encounter issues and need to revert to the Git-based system:
1. Simply **remove the Notion environment variables** from Vercel/`.env.local`.
2. The system will automatically fall back to the `content/` folder.
3. Alternatively, you can revert the code changes using Git:
   ```bash
   git checkout main
   ```

---

## **Tips for Notion Content**
- **Images:** Use Notion's "Image" block. The converter will handle them.
- **Math:** Use Notion's inline or block equations. They are compatible with the site's rendering engine.
- **Quizzes:** You can still embed quizzes by adding the `[quiz] { JSON } [/quiz]` block directly in the Notion page as a text block.

---

## **6. Troubleshooting**

### **"Could not find property with name or id: Status"**
This error occurs if your Notion database is missing a property called exactly **"Status"**.
- Ensure the property name is **"Status"** (case-sensitive).
- Ensure the property type is **Status**.
- The site now handles missing properties gracefully, but without the "Status" property, all entries in the database will be fetched (no "Published" filtering).

### **"Could not find sort property with name or id: Date"**
Similar to the Status error, ensure you have a property named **"Date"** of type **Date**.
- If missing, the site will fetch entries without specific sorting.

### **Content not appearing**
1. Check if the entry is set to **"Published"** in the Status property.
2. Verify that you have **shared the database** with the integration (see Section 1B).
3. Ensure the **Database ID** in your environment variables is correct.
4. If you have just updated Notion, there might be a short delay, or the build cache (if using `p-memoize`) might need to be cleared by a fresh deployment.