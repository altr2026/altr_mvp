# altr_mvp — agent operating rules

## What this repo is

This is the **pre-MVP / demo skeleton** for **demo.altr.haus**. Its purpose is to show a working product surface to investors and partners now, while the real backend is still being built.

**Goal:** investor demo NOW → real product LATER (a *switch*, not a *rewrite*).

## Rules

### 1. All data is mock
- No real database connections yet (no Supabase queries, no Postgres, no XRPL calls).
- Every value displayed in the UI must come from `/src/lib/mock-data.ts`.
- **Do not hardcode values inline** in components, pages, or API routes — always import from `/src/lib/mock-data.ts`.

### 2. API routes return mock data, but are shaped for real swap
- Build real API route handlers (`src/app/api/.../route.ts`) — don't skip them.
- The handler imports from `/src/lib/mock-data.ts` and returns it as JSON.
- Request/response shapes must match what the real backend will eventually return, so the swap is a one-file change inside the route, not a client-side refactor.
- Use proper HTTP status codes, error shapes, and types from day one.

### 3. Every component is production-ready
- No throwaway prototypes. No "we'll fix it later" inline styles.
- TypeScript strict, proper prop types, accessibility considered, responsive.
- Reusable components live in `/src/components/`. Page-specific layout stays in the page file.
- Design tokens (color, spacing, typography) go through Tailwind config — not magic numbers in JSX.

### 4. The mock layer must be the only thing that's "fake"
When the real backend is ready, the only files that should change are:
- `/src/lib/mock-data.ts` → replaced by real data fetchers / DB clients
- Inside each `src/app/api/*/route.ts` → swap the mock import for the real fetcher

Components, pages, types, and the design system must not need to change.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
