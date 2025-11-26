## commands

- `bun run test --run` - run all tests (vitest)
- `bun run test path/to/file.test.ts --run` - run single test file
- `bun lint` - lint with eslint
- `bun run dev` - start dev server on localhost:3000
- `bun run test:e2e` - run e2e tests (playwright)

## code style

- Use Prettier with import sorting: node modules first, then local imports
- TypeScript strict mode enabled, no implicit any
- JSX is server-side only (Hono), not React
- Use `.js` extensions for imports (ESM)
- Fail-fast, avoid nesting and try/catch
- One function = one responsibility
- Top-level doc-comments only for exports

## architecture

- Flat file structure, minimal dependencies
- Server-side JSX for templating, HTMX for client interactivity
- Database: Drizzle ORM with LibSQL
- Testing: Vitest + happy-dom for unit, Playwright for e2e
