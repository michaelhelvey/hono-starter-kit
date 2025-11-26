# Hono Starter Kit

A simple fullstack TypeScript starter template built with Hono, Bun, and server-side JSX. Designed
for rapid development with minimal dependencies and a straightforward architecture.

## Features

- **Hono** - Fast web framework with server-side JSX templating
- **Bun** - Package manager
- **Node.js** - Runtime
- **HTMX** - Client-side interactivity without a JavaScript framework
- **Drizzle ORM** - Type-safe SQLite database with migrations
- **Tailwind CSS** - Utility-first CSS framework
- **Hot Reload** - WebSocket-based live reloading in development
- **Theme Toggle** - Light/dark mode with cookie persistence
- **Request Logging** - Apache-style access logs
- **TypeScript** - Full type safety throughout
- **ESLint + Prettier** - Code formatting with lint-staged and Husky

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed

### Installation

```bash
bun install
```

### Development

Start the development server:

```bash
bun run dev
```

This will:

- Run database migrations
- Push schema changes to the database
- Start the server with hot reloading on `http://localhost:3000`

The server automatically reloads when you make changes to your code.

## Scripts

- `bun run dev` - Start development server with hot reload
- `bun lint` - Lint the codebase
- `bun run build:css` - Build CSS from Tailwind source
- `bun run db:push` - Push schema changes to database
- `bun run db:generate` - Generate migration files
- `bun run db:migrate` - Run database migrations
- `bun run db:nuke` - Reset database (deletes database and migrations)

## Architecture

This project follows a simple, flat file structure:

- `src/index.tsx` - Application entry point and route definitions
- `src/pages/` - Page route handlers
- `src/components/` - Reusable JSX components
- `src/lib/` - Shared utilities and helpers
- `src/middleware/` - Hono middleware
- `src/db/` - Database schema and configuration
- `public/` - Static assets

### Key Concepts

- **Server-Side JSX**: JSX is used for templating on the server only. It doesn't execute on the
  client.
- **HTMX for Interactivity**: Use HTMX attributes (`hx-post`, `hx-swap`, etc.) for dynamic behavior.

## Database

The project uses SQLite with Drizzle ORM. Define your schema in `src/db/schema.ts` and use the
database scripts to manage migrations.

Example schema:

```typescript
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
```

Access the database in your routes:

```typescript
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

const allUsers = await db.select().from(users);
```

## Configuration

- Set `PORT` environment variable to change the server port (default: 3000)
- Set `NODE_ENV=production` to disable hot reloading and development features
