import "dotenv/config";
import { DEFAULT_DEX_PROGRAMS, DEFAULT_WATCHED_MINTS } from "@/lib/solana/constants";
import type { SolanaMonitoringConfig } from "@/lib/solana/types";

const splitCsv = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export interface BotEnvironment {
  config: SolanaMonitoringConfig;
  heliusRpcUrl: string;
  heliusGrpcEndpoint: string;
  heliusApiKey: string;
  jitoBlockEngineUrl: string;
  jitoAuthKeypairPath: string;
  jitoTipLamports: number;
  botApiToken: string;
  botAutoStart: boolean;
  missingRequired: string[];
  warnings: string[];
}

export function getBotEnvironment(): BotEnvironment {
  const heliusRpcUrl =
    process.env.HELIUS_RPC_URL || process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
  const heliusGrpcEndpoint =
    process.env.HELIUS_GRPC_ENDPOINT || process.env.YELLOWSTONE_GRPC_ENDPOINT || "";
  const heliusApiKey = process.env.HELIUS_API_KEY || process.env.YELLOWSTONE_GRPC_TOKEN || "";
  const jitoBlockEngineUrl =
    process.env.JITO_BLOCK_ENGINE_URL || "mainnet.block-engine.jito.wtf";
  const jitoAuthKeypairPath = process.env.JITO_AUTH_KEYPAIR_PATH || "";
  const jitoTipLamports = toNumber(process.env.JITO_TIP_LAMPORTS, 100_000);
  const botApiToken = process.env.BOT_API_TOKEN || "";
  const botAutoStart = (process.env.BOT_AUTO_START || "false").toLowerCase() === "true";
  const watchedWallets = splitCsv(process.env.WATCHED_WALLETS);
  const watchedMints = splitCsv(process.env.WATCHED_MINTS || DEFAULT_WATCHED_MINTS.join(","));
  const dexPrograms = splitCsv(process.env.DEX_PROGRAMS || DEFAULT_DEX_PROGRAMS.join(","));
  const includeFailed = (process.env.INCLUDE_FAILED_TRANSACTIONS || "true").toLowerCase() === "true";
  const commitment = (() => {
    const value = process.env.SOLANA_COMMITMENT || "confirmed";
    return value === "processed" || value === "finalized" ? value : "confirmed";
  })();
  const maxRecentEvents = toNumber(process.env.MAX_RECENT_EVENTS, 500);

  const missingRequired: string[] = [];
  const warnings: string[] = [];

  if (!heliusGrpcEndpoint) {
    missingRequired.push("HELIUS_GRPC_ENDPOINT");
  }

  if (!heliusApiKey) {
    missingRequired.push("HELIUS_API_KEY");
  }

  if (!jitoAuthKeypairPath) {
    warnings.push("JITO_AUTH_KEYPAIR_PATH is not set; Jito bundle submission will remain disabled");
  }

  if (!botApiToken) {
    warnings.push("BOT_API_TOKEN is not set; monitoring API routes will be open on the deployed host");
  }

  return {
    config: {
      watchedWallets,
      watchedMints,
      dexPrograms,
      includeFailed,
      commitment,
      maxRecentEvents,
    },
    heliusRpcUrl,
    heliusGrpcEndpoint,
    heliusApiKey,
    jitoBlockEngineUrl,
    jitoAuthKeypairPath,
    jitoTipLamports,
    botApiToken,
    botAutoStart,
    missingRequired,
    warnings,
  };
}

export function getPublicBotEnvironment() {
  const env = getBotEnvironment();

  return {
    config: env.config,
    missingRequired: env.missingRequired,
    warnings: env.warnings,
    grpc: {
      endpointConfigured: env.heliusGrpcEndpoint.length > 0,
      apiKeyConfigured: env.heliusApiKey.length > 0,
    },
    jito: {
      blockEngineConfigured: env.jitoBlockEngineUrl.length > 0,
      authKeypairConfigured: env.jitoAuthKeypairPath.length > 0,
      tipLamports: env.jitoTipLamports,
    },
  };
}
