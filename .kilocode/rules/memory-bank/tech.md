# Technical Context: Solana Monitoring Backend

## Technology Stack

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| Next.js      | 16.x    | React framework with App Router |
| React        | 19.x    | UI library                      |
| TypeScript   | 5.9.x   | Type-safe JavaScript            |
| Tailwind CSS | 4.x     | Utility-first CSS               |
| Bun          | 1.3.12  | Package manager & runtime       |
| Solana Web3  | 1.98.x  | RPC, transactions, keypairs     |
| Yellowstone  | 5.0.x   | Helius/Yellowstone gRPC stream  |
| Jito         | 4.2.x   | Block-engine searcher client    |

## Development Environment

### Prerequisites

- Bun 1.3.12+ installed (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 22+ for compatibility
- Helius API key with Yellowstone gRPC access
- Optional: Docker for containerized build/run
- Optional: Jito authorized auth keypair for bundle submission

### Commands

```bash
bun install             # Install dependencies
bun dev                 # Start dev server (http://localhost:3000)
bun run build           # Production build
bun start               # Start production server
bun lint                # Run ESLint
bun run typecheck       # Run TypeScript type checking
bun run bot:validate-env # Validate bot environment
bun run bot:health      # Run non-blocking bot health check
bun run bot             # Start long-running Solana monitor
```

## Project Configuration

### Next.js Config (`next.config.ts`)

- App Router enabled
- Standalone output for portable production/container builds
- External server packages for native gRPC/Jito dependencies

### TypeScript Config (`tsconfig.json`)

- Strict mode enabled
- Path alias: `@/*` → `src/*`
- Target: ESNext
- React automatic runtime

### Tailwind CSS 4 (`postcss.config.mjs`)

- Uses `@tailwindcss/postcss` plugin
- CSS-first configuration (v4 style)

### ESLint (`eslint.config.mjs`)

- Uses `eslint-config-next`
- Flat config format

## Key Dependencies

### Production Dependencies

```json
{
  "next": "^16.1.3",
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "@solana/web3.js": "^1.98.4",
  "@triton-one/yellowstone-grpc": "^5.0.9",
  "bs58": "^6.0.0",
  "dotenv": "^17.4.2",
  "jito-ts": "^4.2.1"
}
```

### Dev Dependencies

```json
{
  "typescript": "^5.9.3",
  "@types/node": "^24.10.2",
  "@types/react": "^19.2.7",
  "@types/react-dom": "^19.2.3",
  "@tailwindcss/postcss": "^4.1.17",
  "tailwindcss": "^4.1.17",
  "eslint": "^9.39.1",
  "eslint-config-next": "^16.0.0",
  "tsx": "^4.22.4"
}
```

## File Structure

```
/
├── .gitignore              # Git ignore rules
├── .env.example            # Local environment template
├── .node-version           # Node.js runtime pin
├── .bun-version            # Bun runtime pin
├── bunfig.toml             # Bun install configuration
├── Dockerfile              # Containerized build/run setup
├── .dockerignore           # Docker build ignore rules
├── package.json            # Dependencies and scripts
├── bun.lock                # Bun lockfile
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── postcss.config.mjs      # PostCSS (Tailwind) config
├── eslint.config.mjs       # ESLint configuration
├── public/                 # Static assets
│   └── .gitkeep
└── src/                    # Source code
    ├── app/                # Next.js App Router
    │   ├── api/monitoring  # Backend API routes
    │   ├── layout.tsx      # Root layout
    │   ├── page.tsx        # Mobile-first home page
    │   └── globals.css     # Global mobile-first styles
    ├── bots/               # Bot scripts
    └── lib/
        ├── api-auth.ts     # API token guard
        ├── env.ts          # Environment parsing
        └── solana/         # Solana monitoring backend
```

## Backend Architecture

```
src/lib/solana/
├── constants.ts            # Solana program and default watched addresses
├── helius-grpc.ts          # Yellowstone gRPC stream manager
├── index.ts                # Monitoring backend orchestration
├── jito.ts                 # Jito block-engine client wrapper
├── parser.ts               # gRPC transaction/account event parser
├── risk.ts                 # Rug-risk scoring model
├── store.ts                # In-memory event/activity store
└── types.ts                # Shared TypeScript types
```

## API Routes

| Route | Method | Purpose |
| ----- | ------ | ------- |
| `/api/monitoring` | GET | Return monitoring snapshot |
| `/api/monitoring` | POST | Start or stop monitoring |
| `/api/monitoring/health` | GET | Return Helius and Jito health |
| `/api/monitoring/wallets` | GET | Return watched wallets and activity |
| `/api/monitoring/wallets` | POST | Update watched wallets |
| `/api/monitoring/config` | GET | Return active config |
| `/api/monitoring/config` | POST | Update active config |

## Technical Constraints

### Starting Point

- Minimal structure - expand as needed
- No persistent database by default
- In-memory event store for portability
- No authentication by default unless `BOT_API_TOKEN` is set

### Browser Support

- Modern browsers (ES2020+)
- No IE11 support

## Performance Considerations

### Image Optimization

- Use Next.js `Image` component for optimization
- Place images in `public/` directory

### Bundle Size

- Tree-shaking enabled by default
- Tailwind CSS purges unused styles
- Native gRPC/Jito packages are externalized for server builds

### Core Web Vitals

- Server Components reduce client JavaScript
- Streaming and Suspense for better UX

## Deployment

### Build Output

- Static frontend pages by default
- Dynamic API routes for monitoring backend
- Standalone output enabled for portable production builds

### Environment Variables

- `.env.example` documents optional local values
- Use `.env.local` for local development
- `NEXT_PUBLIC_*` values are safe for client-side exposure
- Never commit Helius keys, Jito keypairs, or `BOT_API_TOKEN`
