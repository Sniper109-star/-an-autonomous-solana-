# Active Context: Next.js Starter Template

## Current State

**Template Status**: ✅ Mobile-first starter ready for development

The template is a Next.js 16 starter with TypeScript, Tailwind CSS 4, Bun, and a polished mobile-first landing page. Dependency and environment setup files are included for repeatable local and containerized setup.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Mobile-first landing page UI/UX with responsive cards, sticky actions, and touch-friendly controls
- [x] Portable setup files for Bun, Node, Docker, and environment variables

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Mobile-first home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout with mobile viewport metadata | ✅ Ready |
| `src/app/globals.css` | Global mobile-first styling | ✅ Ready |
| `.env.example` | Local environment template | ✅ Ready |
| `.node-version` | Node runtime pin | ✅ Ready |
| `.bun-version` | Bun runtime pin | ✅ Ready |
| `Dockerfile` | Containerized build/run setup | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The starter is ready as a polished mobile-first foundation. Next steps depend on user requirements:

1. Add application-specific pages and flows
2. Add components for the target product
3. Add persistent data, auth, or API routes when needed

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-06-15 | Upgraded UI/UX to mobile-first experience; added portable Bun, Node, environment, and Docker setup files |
