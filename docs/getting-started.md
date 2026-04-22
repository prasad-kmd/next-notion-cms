# Getting Started with Next Notion CMS

This guide will walk you through setting up and running Next Notion CMS from scratch.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [Running the Development Server](#running-the-development-server)
- [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Version | Purpose | Download Link |
|----------|---------|---------|---------------|
| **Node.js** | v20.x+ | JavaScript runtime | [Download](https://nodejs.org/) |
| **pnpm** | v9.x+ | Package manager | [Install](https://pnpm.io/installation) |
| **Git** | Latest | Version control | [Download](https://git-scm.com/) |

### Verify Installation

```bash
# Check Node.js version (should be 20.x or higher)
node --version

# Check pnpm version (should be 9.x or higher)
pnpm --version

# Check Git installation
git --version
```

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/prasad-kmd/next-notion-cms.git
cd next-notion-cms
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This will install all required packages including:
- Next.js 16
- Tailwind CSS 4
- Better Auth
- Drizzle ORM
- Shiki syntax highlighter
- And many more...

### Step 3: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env.local
```

---

## Environment Setup

### Minimum Required Variables

For a basic setup to get started quickly, you need at minimum:

```env
# Notion CMS (Optional - site works without it using local content)
NOTION_AUTH_TOKEN=secret_your_token_here

# Database & Auth (Required for authentication features)
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=generate_a_random_32_char_secret
BETTER_AUTH_URL=http://localhost:3000
```

### Generating BETTER_AUTH_SECRET

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Using npx
npx auth secret
```

### Complete Environment Template

See [Configuration Guide](configuration.md) for a complete list of all available environment variables.

---

## Database Configuration

### Step 1: Set Up Supabase

1. Go to [Supabase](https://supabase.com/) and create a free account
2. Create a new project
3. Navigate to **Project Settings > Database**
4. Copy the **Connection String** (URI mode)

### Step 2: Update DATABASE_URL

Add your Supabase connection string to `.env.local`:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres
```

### Step 3: Push Database Schema

```bash
pnpm db:push
```

This command will:
- Create all necessary tables (`user`, `session`, `account`, `verification`)
- Set up proper indexes and constraints
- Initialize the schema defined in `lib/db/schema.ts`

### Step 4: Verify Database Setup

Open Drizzle Studio to inspect your database:

```bash
pnpm db:studio
```

This opens a web interface at `http://localhost:3000` where you can:
- View table structures
- Browse data
- Run SQL queries

---

## Running the Development Server

### Start Development Mode

```bash
pnpm dev
```

The application will start at: **http://localhost:3000**

### What Happens on First Run

1. ✅ Dependencies are verified
2. ✅ Environment variables are validated
3. ✅ Development server compiles
4. ✅ Hot reload is enabled

### Accessing Different Sections

Once running, you can access:

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured content |
| `/blog` | Blog posts listing |
| `/articles` | Technical articles |
| `/projects` | Project showcase |
| `/tutorials` | Tutorial content |
| `/wiki` | Documentation wiki |
| `/authors` | Author directory |
| `/sign-in` | Authentication page |
| `/dashboard` | User dashboard (requires login) |

---

## Next Steps

Congratulations! Your development environment is set up. Here's what to do next:

### Recommended Reading Order

1. **[Configuration Guide](configuration.md)** - Learn about all configuration options
2. **[Notion CMS Setup](notion-setup.md)** - Connect Notion as your CMS
3. **[Authentication Guide](authentication.md)** - Set up OAuth providers
4. **[Content Management](content-management.md)** - Start creating content
5. **[Deployment Guide](deployment.md)** - Deploy to production

### Quick Tasks Checklist

- [ ] Verify the site loads at http://localhost:3000
- [ ] Test navigation between different sections
- [ ] Set up Supabase database
- [ ] Configure at least one OAuth provider
- [ ] Create your first content item
- [ ] Test the authentication flow

---

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm dev -p 3001
```

#### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

#### Database Connection Failed

- Verify your `DATABASE_URL` is correct
- Ensure your IP is allowed in Supabase settings
- Check if the database exists

---

## Related Documentation

- [Architecture Overview](architecture.md) - Understand the system design
- [Components Reference](components.md) - UI component library
- [API Reference](api-reference.md) - Available API endpoints
- [Troubleshooting](troubleshooting.md) - Common issues and solutions

---

**Need Help?** 

- 📖 Read the full [documentation index](README.md)
- 🐛 Report issues on [GitHub](https://github.com/prasad-kmd/next-notion-cms/issues)
- 💬 Join discussions on [GitHub Discussions](https://github.com/prasad-kmd/next-notion-cms/discussions)