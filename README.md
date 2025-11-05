# nodetree.link

A modern URL shortener and link management platform built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- URL shortening and management
- Custom short link aliases
- Link analytics and tracking
- QR code generation
- User authentication
- Redis caching for high performance

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4
- **Code Quality:** Biome (Linting & Formatting)
- **Database:** PostgreSQL
- **Caching:** Redis
- **Git Hooks:** Husky + commitlint

## Prerequisites

- Node.js v18 or higher
- pnpm (recommended) or npm/yarn/bun
- PostgreSQL database
- Redis (for caching)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ruchernchong/node-tree.git
cd node-tree
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment setup

Copy the example environment file and configure your environment variables:

```bash
cp .env.example .env
```

Required environment variables:
- `NEXT_PUBLIC_BASE_URL` - Your application's base URL
- `NEXT_PUBLIC_DOMAIN` - Your application's domain
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret key for authentication
- `AUTH_URL` - Authentication service URL
- `REDIS_URL` - Redis connection string

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/          # Next.js App Router pages and layouts
├── components/   # React components
├── lib/          # Utility libraries and configurations
├── schema/       # Database schemas and validation
├── types/        # TypeScript type definitions
└── utils/        # Helper functions and utilities
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome

## Code Quality

This project uses:
- **Biome** for fast linting and formatting
- **Husky** for Git hooks
- **commitlint** for conventional commit messages

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test additions or changes
- `chore:` - Maintenance tasks

## Development Guidelines

1. Always run `pnpm lint` before committing
2. Follow TypeScript strict mode guidelines
3. Write meaningful commit messages
4. Keep components small and focused
5. Use the established project structure

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
