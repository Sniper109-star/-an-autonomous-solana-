export type RiskLevel = "low" | "medium" | "high" | "critical";

export type BotStatus = "idle" | "starting" | "running" | "stopping" | "error";

export interface SolanaMonitoringConfig {
  watchedWallets: string[];
  watchedMints: string[];
  dexPrograms: string[];
  includeFailed: boolean;
  commitment: "processed" | "confirmed" | "finalized";
  maxRecentEvents: number;
}

export interface TokenTransferEvent {
  mint: string;
  from: string | null;
  to: string | null;
  amount: string;
  decimals: number;
  uiAmountString: string;
  owner: string;
  accountIndex: number;
}

export interface SolanaTransactionEvent {
  id: string;
  signature: string;
  slot: string;
  timestamp: string;
  status: "success" | "failed" | "unknown";
  riskLevel: RiskLevel;
  riskScore: number;
  reasons: string[];
  accounts: string[];
  programIds: string[];
  tokenTransfers: TokenTransferEvent[];
  logMessages: string[];
  fee?: string;
  computeUnitsConsumed?: string;
}

export interface MonitoringSnapshot {
  status: BotStatus;
  connectedAt: string | null;
  lastEventAt: string | null;
  error: string | null;
  watchedWallets: string[];
  watchedMints: string[];
  dexPrograms: string[];
  events: SolanaTransactionEvent[];
  walletActivity: Record<string, number>;
  mintActivity: Record<string, number>;
  programActivity: Record<string, number>;
  grpc: {
    enabled: boolean;
    endpointConfigured: boolean;
    apiKeyConfigured: boolean;
    subscription: "accounts" | "transactions" | "disabled";
  };
  jito: {
    enabled: boolean;
    blockEngineConfigured: boolean;
    authKeypairConfigured: boolean;
    tipLamports: number;
  };
}
