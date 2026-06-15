import { SOLANA_PROGRAMS } from "@/lib/solana/constants";
import type { RiskLevel, SolanaMonitoringConfig, SolanaTransactionEvent } from "@/lib/solana/types";

interface RiskInput {
  config: SolanaMonitoringConfig;
  accounts: string[];
  programIds: string[];
  status: "success" | "failed" | "unknown";
  fee?: string;
  computeUnitsConsumed?: string;
  logMessages: string[];
  tokenTransfers: SolanaTransactionEvent["tokenTransfers"];
}

const watchedSet = (items: string[]) => new Set(items.map((item) => item.toLowerCase()));

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const toRiskLevel = (score: number): RiskLevel => {
  if (score >= 80) return "critical";
  if (score >= 55) return "high";
  if (score >= 30) return "medium";
  return "low";
};

export function scoreTransactionRisk(input: RiskInput) {
  const watchedWallets = watchedSet(input.config.watchedWallets);
  const watchedMints = watchedSet(input.config.watchedMints);
  const dexPrograms = watchedSet(input.config.dexPrograms);
  const scoreBreakdown: Array<{ reason: string; points: number }> = [];

  const addScore = (reason: string, points: number) => {
    scoreBreakdown.push({ reason, points });
  };

  if (input.status === "failed") {
    addScore("Transaction failed on-chain", 35);
  }

  if (input.accounts.some((account) => watchedWallets.has(account))) {
    addScore("Watched wallet participated", 10);
  }

  if (input.programIds.some((programId) => dexPrograms.has(programId))) {
    addScore("Known DEX or aggregator program executed", 8);
  }

  if (input.programIds.includes(SOLANA_PROGRAMS.token2022)) {
    addScore("Token-2022 program involved", 5);
  }

  if (input.tokenTransfers.some((transfer) => watchedMints.has(transfer.mint.toLowerCase()))) {
    addScore("Watched mint transferred", 12);
  }

  if (input.tokenTransfers.length > 2) {
    addScore("Multiple token transfers in one transaction", 8);
  }

  const feeLamports = Number(input.fee ?? 0);
  if (feeLamports >= 10_000_000) {
    addScore("Unusually high transaction fee", 8);
  }

  const computeUnits = Number(input.computeUnitsConsumed ?? 0);
  if (computeUnits >= 1_000_000) {
    addScore("High compute unit consumption", 6);
  }

  const logs = input.logMessages.join(" ").toLowerCase();
  if (logs.includes("slippage") || logs.includes("price impact")) {
    addScore("Slippage or price-impact language detected", 12);
  }

  if (logs.includes("custom program error") || logs.includes("insufficient funds")) {
    addScore("Program error or insufficient-funds signal detected", 10);
  }

  const score = clamp(scoreBreakdown.reduce((total, item) => total + item.points, 0));

  return {
    riskScore: score,
    riskLevel: toRiskLevel(score),
    reasons: scoreBreakdown.length > 0
      ? scoreBreakdown.map((item) => `${item.reason} (+${item.points})`)
      : ["No high-risk indicators detected"],
  };
}
