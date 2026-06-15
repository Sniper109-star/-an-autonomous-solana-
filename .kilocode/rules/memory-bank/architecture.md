# System Patterns: Solana Monitoring Backend

## Architecture Overview

```
src/
├── app/                         # Next.js App Router
│   ├── api/
│   │   └── monitoring/          # Backend API routes
│   ├── layout.tsx               # Root layout + metadata
│   ├── page.tsx                 # Mobile-first home page
│   ├── globals.css              # Tailwind imports + global styles
│   └── favicon.ico              # Site icon
├── bots/                        # Standalone bot scripts
│   ├── health.ts                # Non-blocking health check
│   ├── solana-monitor.ts        # Long-running monitor
│   └── validate-env.ts          # Environment validation
└── lib/
    ├── api-auth.ts              # Optional API token guard
    ├── env.ts                   # Environment parsing
    └── solana/                  # Solana monitoring backend
        ├── constants.ts         # Solana program addresses
        ├── helius-grpc.ts       # Yellowstone gRPC stream manager
        ├── index.ts             # Monitoring backend orchestration
        ├── jito.ts              # Jito block-engine wrapper
        ├── parser.ts            # gRPC event parser
        ├── risk.ts              # Rug-risk scoring
        ├── store.ts             # In-memory event store
        └── types.ts             # Shared types
```

## Key Design Patterns

### 1. App Router API Pattern

Backend endpoints live under `src/app/api/monitoring`:

```txt
/api/monitoring           # Start/stop/status
/api/monitoring/health    # Health
/api/monitoring/wallets   # Watched wallets
/api/monitoring/config    # Runtime config
```

Server routes use `NextResponse.json` and `dynamic = "force-dynamic"` where real-time state is returned.

### 2. Backend Orchestration Pattern

`src/lib/solana/index.ts` owns the singleton `monitoringBackend`, which coordinates:

1. Environment loading
2. Helius gRPC stream lifecycle
3. Jito health checks
4. In-memory event indexing
5. Runtime configuration updates

### 3. Streaming Pattern

`src/lib/solana/helius-grpc.ts` wraps the Yellowstone gRPC client and exposes:

- `connect()`
- `disconnect()`
- `health()`
- Transaction and account update handling

The stream uses reconnect options and keepalive pings.

### 4. Event Parsing Pattern

`src/lib/solana/parser.ts` converts raw Yellowstone gRPC objects into normalized `SolanaTransactionEvent` records with:

- Signature
- Slot
- Status
- Accounts
- Program IDs
- Token transfers
- Logs
- Risk score and reasons

### 5. Risk Scoring Pattern

`src/lib/solana/risk.ts` keeps risk logic transparent and adjustable. Each signal contributes points, then the final score maps to `low`, `medium`, `high`, or `critical`.

### 6. Server Components by Default

All React components are Server Components unless marked with `"use client"`. Bot and backend logic remains outside React client components.

## Styling Conventions

### Tailwind CSS Usage

- Utility classes directly on elements
- Component composition for repeated patterns
- Responsive: `sm:`, `md:`, `lg:`, `xl:`
- Mobile-first spacing and touch targets

## File Naming Conventions

- Components: PascalCase
- Utilities: camelCase
- Pages/Routes: lowercase
- Backend modules: domain-based under `src/lib/solana`

## State Management

### Frontend

- Static content by default
- Add client state only when interactive UI is required

### Backend

- In-memory event store for portability
- Add persistent storage when replay or durability is required

## Security Patterns

- Optional `BOT_API_TOKEN` guard for POST routes
- Environment variables for secrets
- No private keys committed
- Jito auth keypair loaded only from local file path
- Helius API key never exposed to client
