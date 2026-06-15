import bs58 from "bs58";
import type {
  SubscribeUpdateAccount,
  SubscribeUpdateTransaction,
  SubscribeUpdateTransactionInfo,
} from "@triton-one/yellowstone-grpc";
import { SOLANA_PROGRAMS } from "@/lib/solana/constants";
import { scoreTransactionRisk } from "@/lib/solana/risk";
import type { SolanaMonitoringConfig, SolanaTransactionEvent } from "@/lib/solana/types";

const encodePubkey = (value: Uint8Array | string) =>
  typeof value === "string" ? value : bs58.encode(value);

const unique = (items: string[]) => [...new Set(items.filter(Boolean))];

const getTokenTransfers = (info: SubscribeUpdateTransactionInfo) => {
  const meta = info?.meta;
  if (!meta?.preTokenBalances || !meta.postTokenBalances) {
    return [];
  }

  const postByIndex = new Map(meta.postTokenBalances.map((balance) => [balance.accountIndex, balance]));

  return meta.preTokenBalances.flatMap((preBalance) => {
    const postBalance = postByIndex.get(preBalance.accountIndex);
    const preAmount = preBalance.uiTokenAmount?.amount ?? "0";
    const postAmount = postBalance?.uiTokenAmount?.amount ?? preAmount;
    if (!postBalance || preAmount === postAmount) {
      return [];
    }

    return [
      {
        mint: preBalance.mint,
        from: null,
        to: null,
        amount: preAmount,
        decimals: preBalance.uiTokenAmount?.decimals ?? 0,
        uiAmountString: preBalance.uiTokenAmount?.uiAmountString ?? preAmount,
        owner: preBalance.owner,
        accountIndex: preBalance.accountIndex,
      },
    ];
  });
};

const getProgramIds = (info: SubscribeUpdateTransactionInfo) => {
  const transaction = info.transaction;
  const message = transaction?.message;
  const accountKeys = message?.accountKeys.map((key) => encodePubkey(key)) ?? [];
  const programIds = new Set<string>();

  for (const instruction of message?.instructions ?? []) {
    const programId = accountKeys[instruction.programIdIndex];
    if (programId) {
      programIds.add(programId);
    }
  }

  if (!info?.meta?.innerInstructionsNone) {
    for (const innerInstruction of info?.meta?.innerInstructions ?? []) {
      for (const instruction of innerInstruction.instructions) {
        const programId = accountKeys[instruction.programIdIndex];
        if (programId) {
          programIds.add(programId);
        }
      }
    }
  }

  return [...programIds];
};

export function extractTransactionEvent(
  update: SubscribeUpdateTransaction,
  config: SolanaMonitoringConfig,
): SolanaTransactionEvent {
  const info = update.transaction;
  if (!info) {
    throw new Error("Transaction update did not include transaction data");
  }

  const signature = encodePubkey(info.signature);
  const transaction = info.transaction;
  const meta = info.meta;
  const accounts = unique(transaction?.message?.accountKeys.map(encodePubkey) ?? []);
  const programIds = unique(getProgramIds(info));
  const tokenTransfers = getTokenTransfers(info);
  const status = meta?.err ? "failed" : meta ? "success" : "unknown";
  const risk = scoreTransactionRisk({
    config,
    accounts,
    programIds,
    status,
    fee: meta?.fee,
    computeUnitsConsumed: meta?.computeUnitsConsumed,
    logMessages: meta?.logMessagesNone ? [] : (meta?.logMessages ?? []),
    tokenTransfers,
  });

  return {
    id: `${update.slot}-${signature}`,
    signature,
    slot: update.slot,
    timestamp: new Date().toISOString(),
    status,
    riskLevel: risk.riskLevel,
    riskScore: risk.riskScore,
    reasons: risk.reasons,
    accounts,
    programIds,
    tokenTransfers,
    logMessages: meta?.logMessagesNone ? [] : (meta?.logMessages ?? []),
    fee: meta?.fee,
    computeUnitsConsumed: meta?.computeUnitsConsumed,
  };
}

export function extractAccountEvent(
  update: SubscribeUpdateAccount,
  config: SolanaMonitoringConfig,
): SolanaTransactionEvent {
  const account = update.account;
  if (!account) {
    throw new Error("Account update did not include account data");
  }

  const pubkey = encodePubkey(account.pubkey);
  const owner = encodePubkey(account.owner);
  const signature = account.txnSignature ? encodePubkey(account.txnSignature) : `account:${pubkey}`;
  const programIds = [owner];
  const risk = scoreTransactionRisk({
    config,
    accounts: [pubkey],
    programIds,
    status: "unknown",
    logMessages: [],
    tokenTransfers: [],
  });

  return {
    id: `${update.slot}-${signature}`,
    signature,
    slot: update.slot,
    timestamp: new Date().toISOString(),
    status: "unknown",
    riskLevel: risk.riskLevel,
    riskScore: risk.riskScore,
    reasons: risk.reasons,
    accounts: [pubkey],
    programIds,
    tokenTransfers: [],
    logMessages: [],
  };
}

export function isWatchedAccount(pubkey: string, config: SolanaMonitoringConfig) {
  const watched = new Set(config.watchedWallets.map((item) => item.toLowerCase()));
  return watched.has(pubkey.toLowerCase());
}

export function isWatchedMint(mint: string, config: SolanaMonitoringConfig) {
  const watched = new Set(config.watchedMints.map((item) => item.toLowerCase()));
  return watched.has(mint.toLowerCase());
}

export function isKnownDexProgram(programId: string, config: SolanaMonitoringConfig) {
  const programs = new Set(config.dexPrograms.map((item) => item.toLowerCase()));
  return programs.has(programId.toLowerCase()) || programId === SOLANA_PROGRAMS.jupiterAggregatorV6;
}
