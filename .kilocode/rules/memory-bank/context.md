# Active Context: Solana Monitoring Backend

## Current State

**Template Status**: ✅ Mobile-first Solana monitoring backend ready

The project is a Next.js 16 starter with TypeScript, Tailwind CSS 4, Bun, a polished mobile-first frontend, and a Solana monitoring backend using Helius Yellowstone gRPC, Jito block-engine integration, wallet/mint/DEX indexing, and rug-risk scoring.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Mobile-first landing page UI/UX with responsive cards, sticky actions, and touch-friendly controls
- [x] Portable setup files for Bun, Node, Docker, and environment variables
- [x] Helius Yellowstone gRPC streaming service
- [x] Jito block-engine integration scaffold
- [x] Real-time wallet, transaction, mint, and DEX monitoring backend
- [x] In-memory Solana event store and risk scoring utilities
- [x] Monitoring API routes for status, health, wallets, and config
- [x] Bot validation, health, and long-running scripts
- [x] Executive README with setup, architecture, API, and operations guidance

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Mobile-first home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout with mobile viewport metadata | ✅ Ready |
| `src/app/globals.css` | Global mobile-first styling | ✅ Ready |
| `src/app/api/monitoring/route.ts` | Start/stop/status API | ✅ Ready |
| `src/app/api/monitoring/health/route.ts` | Backend health API | ✅ Ready |
| `src/app/api/monitoring/wallets/route.ts` | Watched wallet API | ✅ Ready |
| `src/app/api/monitoring/config/route.ts` | Runtime config API | ✅ Ready |
| `src/bots/solana-monitor.ts` | Long-running monitoring bot | ✅ Ready |
| `src/bots/health.ts` | Non-blocking bot health check | ✅ Ready |
| `src/bots/validate-env.ts` | Environment validation | ✅ Ready |
| `src/lib/solana/` | Solana backend services, parser, risk model, store | ✅ Ready |
| `.env.example` | Local environment template | ✅ Ready |
| `.node-version` | Node runtime pin | ✅ Ready |
| `.bun-version` | Bun runtime pin | ✅ Ready |
| `Dockerfile` | Containerized build/run setup | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The starter is ready as a mobile-first Solana monitoring foundation. Next steps depend on user requirements:

1. Add persistent storage for replayable indexing
2. Add WebSocket streaming for live frontend updates
3. Add richer rug-risk heuristics and allowlist/blocklist data
4. Add authentication, rate limiting, and audit logs for public deployments
5. Add production alerting through webhooks, Discord, Telegram, or email

## Quick Start Guide

### Install dependencies

```bash
bun install
```

### Configure environment

```bash
cp .env.example .env.local
```

Set at minimum:

```env
HELIUS_RPC_URL="https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY"
HELIUS_GRPC_ENDPOINT="https://YOUR_HELIUS_GRPC_ENDPOINT"
HELIUS_API_KEY="YOUR_HELIUS_API_KEY"
BOT_API_TOKEN="change-me"
```

### Validate bot environment

```bash
bun run bot:validate-env
```

### Run health check

```bash
bun run bot:health
```

### Start monitoring bot

```bash
bun run bot
```

### Build production app

```bash
bun run build
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add persistent event storage
- [ ] Add WebSocket live event stream
- [ ] Add production authentication and rate limiting
- [ ] Add mint metadata and liquidity enrichment
- [ ] Add alerting integrations
- [ ] Add backtesting for risk rules

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-06-15 | Upgraded UI/UX to mobile-first experience; added portable Bun, Node, environment, and Docker setup files |
| 2026-06-15 | Added Helius Yellowstone gRPC, Jito integration, Solana monitoring backend, risk scoring, API routes, bot scripts, and executive README |
