# nodetree.link

A personal link hub with SaaS-ready architecture built with Next.js 16, featuring privacy-focused analytics, multi-tenancy, and OAuth authentication.

## Features

- 🔗 Unlimited custom links
- 📊 Privacy-focused analytics (IP hashing)
- 🎨 Dark theme with Tailwind CSS v4
- ⏱️ Link scheduling
- 🔐 OAuth authentication (GitHub, Google)
- 📱 Mobile responsive
- 🚀 Edge deployed
- 🗄️ Multi-tenant architecture (per-user SQLite databases)

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide Icons

### Backend
- Better Auth
- Turso (SQLite at the edge)
- Drizzle ORM
- Upstash Redis

### Infrastructure
- Vercel
- Biome (linter/formatter)
- Husky + commitlint

## Prerequisites

- Node.js 18+
- Turso account
- Upstash account
- GitHub OAuth App credentials
- Google OAuth credentials (optional)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ruchernchong/node-tree.git
cd node-tree
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Fill in the required variables:

#### Required:
- `BETTER_AUTH_SECRET` - Generate: `openssl rand -base64 32`
- `TURSO_CENTRAL_DB_URL` - Turso database URL
- `TURSO_AUTH_TOKEN` - Turso auth token
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `IP_SALT` - Generate: `openssl rand -base64 32`

#### Optional:
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `ADMIN_USER_ID` - Admin user ID
- `ADMIN_USERNAME` - Admin username

### 4. Set Up Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create node-tree-central

# Get database URL
turso db show node-tree-central --url

# Create auth token
turso db tokens create node-tree-central
```

### 5. Set Up Upstash Redis

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and token

### 6. Set Up OAuth Providers

#### GitHub OAuth:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret

#### Google OAuth (Optional):
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Set callback URL: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret

### 7. Run Database Migrations

```bash
pnpm db:push
```

### 8. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

This project uses Next.js 16 App Router with **colocation pattern**:

```
src/
├── app/
│   ├── (admin)/          # Admin route group
│   │   └── _components/  # Admin-specific components
│   ├── (public)/         # Public route group
│   │   └── _components/  # Public-specific components
│   └── api/              # API routes
├── components/
│   ├── ui/              # shadcn/ui components (global)
│   └── layout/          # Global layout components
├── lib/
│   ├── db/             # Database configuration
│   └── auth/           # Auth configuration
├── schema/             # Drizzle ORM schemas
│   ├── central/
│   └── user/
├── types/              # Shared TypeScript types
└── config/             # Configuration files
```

### Colocation Pattern

Route-specific code lives next to the routes that use them in **private folders** (prefixed with `_`):
- `_components/` - Components used only in this route
- `_lib/` - Data fetching and business logic
- `_utils/` - Utility functions
- `_hooks/` - Custom React hooks

Only truly shared code lives in `src/components/`, `src/lib/`, etc.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

### Production Checklist:
- [ ] Update `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_DOMAIN`
- [ ] Update OAuth callback URLs to production domain
- [ ] Set `BETTER_AUTH_URL` to production URL
- [ ] Configure custom domain in Vercel
- [ ] Run database migrations in production
- [ ] Test authentication flows
- [ ] Verify analytics tracking

## License

MIT
