# Notion CMS Setup Guide

This guide provides step-by-step instructions for integrating Notion as your headless CMS.

## Table of Contents

- [Overview](#overview)
- [Creating Notion Integration](#creating-notion-integration)
- [Database Setup](#database-setup)
- [Database Schema](#database-schema)
- [Connecting Databases](#connecting-databases)
- [Environment Configuration](#environment-configuration)
- [Content Creation](#content-creation)
- [Troubleshooting](#troubleshooting)

---

## Overview

Next Notion CMS uses Notion as a headless CMS, allowing you to manage all your content through Notion's intuitive interface while maintaining a high-performance Next.js frontend.

### Benefits

- ✨ **Visual Editor**: Rich text editing with drag-and-drop
- 🔄 **Real-time Updates**: Changes sync automatically
- 📱 **Mobile Access**: Edit content on the go
- 🎯 **No Code Required**: Non-technical team members can contribute

---

## Creating Notion Integration

### Step 1: Create Integration

1. Go to [Notion - My Integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in the details:
   - **Name**: Engineering Blogfolio CMS (or your preferred name)
   - **Logo**: Optional brand image
   - **Description**: Brief description of your integration
4. Select your workspace
5. Keep default capabilities:
   - ✅ Read content
   - ✅ Update content  
   - ✅ Insert content
   - ❌ No user information needed
6. Click **Submit**

### Step 2: Copy Integration Token

After creating the integration:
1. Click on your integration
2. Copy the **Internal Integration Token**
3. Save it securely - this is your `NOTION_AUTH_TOKEN`

```env
NOTION_AUTH_TOKEN=secret_your_token_here
```

⚠️ **Important**: Never commit this token to version control!

---

## Database Setup

### Required Databases

Create **six** databases in Notion:

1. **Blog** - For blog posts
2. **Articles** - For technical articles
3. **Tutorials** - For tutorial content
4. **Projects** - For project showcase
5. **Wiki** - For documentation
6. **Authors** - For author profiles

### Creating a Database

1. Open Notion and create a new page
2. Type `/database` and select **Database - Table**
3. Name your database (e.g., "Blog")
4. Configure properties according to the schema below

---

## Database Schema

### Content Databases (Blog, Articles, Tutorials, Projects, Wiki)

| Property Name | Type | Required | Description |
|--------------|------|----------|-------------|
| **Name** | Title | ✅ | Display title (auto-detected) |
| **Slug** | Text | ✅ | URL-friendly identifier |
| **Authors** | Relation | ❌ | Link to Authors database |
| **Date** | Date | ✅ | Publication date |
| **Status** | Status | ✅ | Draft/Published toggle |
| **Description** | Text | ✅ | Short summary for cards |
| **Tags** | Multi-select | ❌ | Keywords for filtering |
| **Categories** | Select | ❌ | Main category |
| **AIAssisted** | Checkbox | ❌ | AI usage indicator |
| **Technical** | Multi-select | ❌ | Tech stack tags |

### Authors Database

| Property Name | Type | Required | Description |
|--------------|------|----------|-------------|
| **Name** | Title | ✅ | Author's display name |
| **Slug** | Text | ✅ | URL-friendly identifier |
| **Role** | Text | ❌ | Job title/role |
| **Biography** | Text | ❌ | Short bio |
| **Avatar** | Files | ❌ | Profile photo |
| **Twitter** | Text | ❌ | Twitter username |
| **GitHub** | Text | ❌ | GitHub username |
| **LinkedIn** | Text | ❌ | LinkedIn username |
| **Status** | Status | ✅ | Published/Draft |

---

## Connecting Databases

### Share Each Database with Integration

For **each** of the six databases:

1. Open the database in Notion
2. Click the three dots **(...)** in top-right
3. Scroll to **"Connect to"**
4. Search for your integration name
5. Select and confirm

### Getting Database IDs

The database ID is part of the URL:

```
https://www.notion.so/workspace/DATABASE_ID?v=...
                                  ^^^^^^^^^^
```

**Example:**
- URL: `https://www.notion.so/myworkspace/a1b2c3d4e5f6?v=abc123`
- Database ID: `a1b2c3d4e5f6`

Copy all six database IDs for environment configuration.

---

## Environment Configuration

Add to your `.env.local`:

```env
# Notion Integration
NOTION_AUTH_TOKEN=secret_your_integration_token

# Database IDs
NOTION_BLOG_ID=a1b2c3d4e5f6g7h8i9j0
NOTION_ARTICLES_ID=k1l2m3n4o5p6q7r8s9t0
NOTION_TUTORIALS_ID=u1v2w3x4y5z6a7b8c9d0
NOTION_PROJECTS_ID=e1f2g3h4i5j6k7l8m9n0
NOTION_WIKI_ID=o1p2q3r4s5t6u7v8w9x0
NOTION_AUTHORS_ID=y1z2a3b4c5d6e7f8g9h0
```

---

## Content Creation

### Creating Your First Blog Post

1. Open your **Blog** database in Notion
2. Click **"+ New"**
3. Fill in required fields:
   - **Name**: "My First Blog Post"
   - **Slug**: "my-first-blog-post"
   - **Date**: Today's date
   - **Status**: Published
   - **Description**: A brief summary
4. Add content in the page body:
   - Text blocks
   - Images
   - Code blocks
   - Equations
   - Bookmarks
5. Save and wait ~1 hour for cache refresh

### Supported Notion Blocks

The system automatically converts:

- ✅ Text paragraphs
- ✅ Headings (H1, H2, H3)
- ✅ Images
- ✅ Code blocks with syntax highlighting
- ✅ Equations (LaTeX)
- ✅ Bookmarks (with OG preview)
- ✅ File attachments
- ✅ Callouts
- ✅ Columns
- ✅ Tabs
- ✅ Embeds (YouTube, Gist, etc.)

### Special Features

#### Math Equations

Use Notion's equation blocks:
- Inline: `$E=mc^2$`
- Block: `$$F=ma$$`

#### Quizzes

Embed quizzes using shortcode:
```
[quiz] { "questions": [...] } [/quiz]
```

#### GitHub Alerts

Format as callouts with specific icons:
- `[!NOTE]` - Blue info icon
- `[!TIP]` - Green lightbulb
- `[!WARNING]` - Yellow warning
- `[!CAUTION]` - Red alert
- `[!IMPORTANT]` - Purple star

---

## Troubleshooting

### "Could not find property: Status"

**Solution:**
1. Ensure property is named exactly **"Status"** (case-sensitive)
2. Verify property type is **Status** (not Select)
3. Add the property if missing

### Content Not Appearing

Checklist:
- [ ] Status is set to "Published"
- [ ] Database is shared with integration
- [ ] Database ID is correct
- [ ] Wait for cache revalidation (1 hour)
- [ ] Check browser console for errors

### Slow Updates

**Understanding Cache:**
- API responses cached for 1 hour
- ISR revalidation: 1 hour
- **Immediate update**: Trigger manual Vercel redeployment

### Rate Limiting

Notion API limits:
- 3 requests/second
- If exceeded, implement exponential backoff

---

## Related Documentation

- [Configuration Guide](configuration.md) - All config options
- [Content Management](content-management.md) - Creating content
- [Architecture](architecture.md) - How Notion integration works
- [Troubleshooting](troubleshooting.md) - Common issues

---

## Tips for Best Results

1. **Use Consistent Slugs**: Lowercase, hyphens, no special characters
2. **Add Descriptions**: Improves SEO and card previews
3. **Tag Content**: Makes filtering and search more effective
4. **Link Authors**: Creates rich author profile pages
5. **Preview Before Publishing**: Use Notion's preview mode
6. **Organize with Tags**: Create a tagging taxonomy beforehand
