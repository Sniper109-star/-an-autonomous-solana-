# Mobile-First Solana Monitoring Backend

A production-oriented Next.js 16, TypeScript, Tailwind CSS, Bun, Helius Yellowstone gRPC, and Jito-ready backend for real-time Solana wallet monitoring, transaction indexing, DEX activity detection, and rug-risk scoring.

The application combines a polished mobile-first frontend with a backend monitoring layer designed for custom Solana trading, research, and risk systems. It streams Solana activity through Helius/Yellowstone gRPC, indexes transactions in memory, scores risk indicators, and exposes operational APIs for wallet/mint/program configuration.

> This project provides monitoring, indexing, and risk signals. It does not guarantee profit, prevent all rug pulls, or replace independent smart-contract, market, and execution-risk review.

## Executive Summary

This repository is a mobile-first Next.js application with a backend runtime for Solana market surveillance.

### Core capabilities

- **Real-time Solana streaming** through Helius Yellowstone gRPC.
- **Wallet monitoring** for configured public keys.
- **Mint and token-transfer monitoring** for watched SPL and Token-2022 mints.
- **DEX/aggregator indexing** for Raydium, Meteora, and Jupiter activity.
- **Risk scoring** for failed transactions, watched wallets, watched mints, high fees, high compute usage, slippage language, and Token-2022 involvement.
- **Jito block-engine integration** for tip account discovery, leader visibility, and bundle submission scaffolding.
- **Protected backend APIs** for runtime monitoring configuration.
- **Portable setup** with Bun, Node version pins, Docker, lockfile, and environment templates.

## Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| App framework | Next.js 16 App Router | Frontend and API backend |
| Runtime | React 19 + TypeScript | Type-safe UI and backend logic |
| Styling | Tailwind CSS 4 | Mobile-first responsive styling |
| Package manager | Bun 1.3.12 | Fast dependency installation and scripts |
| Solana RPC | `@solana/web3.js` | RPC, transactions, keypairs |
| Streaming | `@triton-one/yellowstone-grpc` | Helius/Yellowstone gRPC subscriptions |
| MEV/Jito | `jito-ts` | Jito block-engine searcher client |
| Encoding | `bs58` | Solana pubkey/signature encoding |
| Runtime env | `dotenv` | Local bot script environment loading |
| Script runner | `tsx` | TypeScript bot command execution |

## Repository Structure

```txt
/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── monitoring/
│   │   │       ├── route.ts              # Start/stop/status API
│   │   │       ├── health/route.ts       # Backend health API
│   │   │       ├── wallets/route.ts      # Watched wallet API
│   │   │       └── config/route.ts       # Runtime config API
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── bots/
│   │   ├── health.ts                     # Non-blocking health check
│   │   ├── solana-monitor.ts             # Long-running bot process
│   │   └── validate-env.ts               # Environment validation
│   └── lib/
│       ├── api-auth.ts
│       ├── env.ts
│       └── solana/
│           ├── constants.ts
│           ├── helius-grpc.ts
│           ├── index.ts
│           ├── jito.ts
│           ├── parser.ts
│           ├── risk.ts
│           ├── store.ts
│           └── types.ts
├── .env.example
├── .bun-version
├── .node-version
├── Dockerfile
├── bun.lock
├── package.json
└── tsconfig.json
```

## Environment Setup

### Prerequisites

- Bun `1.3.12+`
- Node.js `22+`
- Helius API key with Yellowstone gRPC access
- Optional: Jito block-engine auth keypair for bundle submission

### Install dependencies

```bash
bun install
```

### Configure environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Required variables for live streaming:

```env
HELIUS_RPC_URL="https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY"
HELIUS_GRPC_ENDPOINT="https://YOUR_HELIUS_GRPC_ENDPOINT"
HELIUS_API_KEY="YOUR_HELIUS_API_KEY"
```

Optional but recommended:

```env
SOLANA_COMMITMENT="confirmed"
WATCHED_WALLETS="WalletPublicKeyOne,WalletPublicKeyTwo"
WATCHED_MINTS="So11111111111111111111111111111111111111112,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
DEX_PROGRAMS="675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8,CAMMCzo5YL8w4VFF8KVHrK22GGUQpMpTFb6xRmpLFGNn,JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
INCLUDE_FAILED_TRANSACTIONS="true"
MAX_RECENT_EVENTS="500"
BOT_API_TOKEN="change-me"
BOT_AUTO_START="false"
```

Jito bundle submission requires an authorized Jito keypair:

```env
JITO_BLOCK_ENGINE_URL="mainnet.block-engine.jito.wtf"
JITO_AUTH_KEYPAIR_PATH="./keys/jito-auth.json"
JITO_TIP_LAMPORTS="100000"
```

Do not commit `.env.local` or private key files.

## Scripts

| Command | Purpose |
| --- | --- |
| `bun dev` | Start Next.js development server |
| `bun run build` | Production build |
| `bun start` | Start production server |
| `bun lint` | ESLint check |
| `bun run typecheck` | TypeScript check |
| `bun run bot:validate-env` | Validate required environment variables |
| `bun run bot:health` | Run non-blocking backend health check |
| `bun run bot` | Start the long-running Solana monitoring bot |

## Bot Operation

Validate configuration:

```bash
bun run bot:validate-env
```

Run a non-blocking health check:

```bash
bun run bot:health
```

Start the long-running bot:

```bash
bun run bot
```

The bot will:

1. Load environment variables.
2. Validate Helius gRPC requirements.
3. Open a Yellowstone gRPC subscription.
4. Index wallet, mint, DEX, and transaction activity.
5. Score transactions for rug-risk indicators.
6. Keep an in-memory rolling event store.
7. Respond to `SIGINT` and `SIGTERM` for graceful shutdown.

## Backend API

### `GET /api/monitoring`

Returns the current monitoring snapshot.

```txt
{
  "status": "idle",
  "watchedWallets": [],
  "watchedMints": [],
  "dexPrograms": [],
  "events": [],
  "walletActivity": {},
  "mintActivity": {},
  "programActivity": {}
}
```

### `POST /api/monitoring`

Starts or stops the backend. Requires `BOT_API_TOKEN` when configured.

```bash
curl -X POST http://localhost:3000/api/monitoring \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BOT_API_TOKEN" \
  -d '{"action":"start"}'
```

### `GET /api/monitoring/health`

Returns Helius gRPC and Jito health status.

### `GET /api/monitoring/wallets`

Returns watched wallets and wallet activity counts.

### `POST /api/monitoring/wallets`

Updates watched wallets.

```bash
curl -X POST http://localhost:3000/api/monitoring/wallets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BOT_API_TOKEN" \
  -d '{"add":["WalletPublicKey"]}'
```

### `GET /api/monitoring/config`

Returns the active monitoring configuration.

### `POST /api/monitoring/config`

Updates monitoring configuration at runtime.

```bash
curl -X POST http://localhost:3000/api/monitoring/config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BOT_API_TOKEN" \
  -d '{"includeFailed":true,"commitment":"confirmed"}'
```

## Risk Model

The backend scores each indexed transaction from `0` to `100`.

| Signal | Points |
| --- | ---: |
| Failed transaction | +35 |
| Watched wallet participated | +10 |
| Known DEX/aggregator executed | +8 |
| Token-2022 program involved | +5 |
| Watched mint transferred | +12 |
| Multiple token transfers | +8 |
| Unusually high fee | +8 |
| High compute unit consumption | +6 |
| Slippage/price-impact language | +12 |
| Program error or insufficient-funds signal | +10 |

Risk levels:

| Score | Level |
| ---: | --- |
| 0-29 | Low |
| 30-54 | Medium |
| 55-79 | High |
| 80-100 | Critical |

This model is intentionally transparent and adjustable. Extend `src/lib/solana/risk.ts` for project-specific heuristics such as mint age, liquidity depth, holder concentration, creator history, or known scam databases.

## Helius Yellowstone gRPC

The streaming backend uses `@triton-one/yellowstone-grpc` and subscribes to:

- Wallet account updates.
- Transactions involving watched wallets, mints, and DEX/aggregator programs.
- Failed transactions when enabled.
- Commitment level configured by `SOLANA_COMMITMENT`.

The stream includes keepalive pings and reconnect options through the Yellowstone client.

## Jito Integration

The Jito layer provides:

- Tip account discovery.
- Next scheduled leader visibility.
- Bundle submission scaffolding.
- Memo bundle builder for authorized testing.

Jito bundle submission is disabled unless `JITO_AUTH_KEYPAIR_PATH` points to a valid authorized keypair file.

Important: bundle submission can spend SOL as priority tips. Test with small values and validate all transactions before using real capital.

## Security Notes

- Never commit `.env.local`, `.env.production`, or private key files.
- Set `BOT_API_TOKEN` before deploying monitoring APIs.
- Store Jito keypairs outside the repository.
- Restrict Helius API keys to required endpoints where possible.
- Add authentication, rate limits, and audit logs before exposing APIs publicly.
- Treat risk scores as signals, not guarantees.

## Docker

Build:

```bash
docker build -t solana-monitoring-backend .
```

Run:

```bash
docker run --rm -p 3000:3000 --env-file .env.local solana-monitoring-backend
```

The Dockerfile uses Next.js standalone output for a smaller production image.

## Development Workflow

1. Install dependencies:

   ```bash
   bun install
   ```

2. Copy environment:

   ```bash
   cp .env.example .env.local
   ```

3. Validate environment:

   ```bash
   bun run bot:validate-env
   ```

4. Start local app:

   ```bash
   bun dev
   ```

5. Start bot in a separate terminal:

   ```bash
   bun run bot
   ```

6. Run checks before committing:

   ```bash
   bun run typecheck
   bun lint
   bun run build
   ```

## Production Checklist

- [ ] Configure Helius RPC and Yellowstone gRPC endpoints.
- [ ] Set `BOT_API_TOKEN`.
- [ ] Add watched wallets and mints.
- [ ] Confirm DEX/aggregator program list.
- [ ] Decide whether failed transactions should be included.
- [ ] Add persistent storage if events must survive restarts.
- [ ] Add authentication and rate limiting for public deployments.
- [ ] Test Jito bundle submission with minimal tip values.
- [ ] Monitor logs, gRPC reconnects, and API latency.

## Limitations and Next Steps

Current implementation uses an in-memory event store. For production trading infrastructure, add persistent storage such as Postgres, ClickHouse, or a time-series database.

Recommended next improvements:

- Persistent event storage and replay.
- WebSocket endpoint for live frontend updates.
- Mint metadata and token account enrichment.
- Liquidity and pool-reserve checks.
- Holder concentration analytics.
- Creator/developer history scoring.
- Known scam-address allowlists/blocklists.
- Backtesting framework for risk rules.
- Alerting through email, Discord, Telegram, or webhook.
