import type { SolanaMonitoringConfig, SolanaTransactionEvent } from "@/lib/solana/types";

const MAX_EVENTS = 500;

export class SolanaEventStore {
  private events: SolanaTransactionEvent[] = [];
  private walletActivity = new Map<string, number>();
  private mintActivity = new Map<string, number>();
  private programActivity = new Map<string, number>();
  private connectedAt: string | null = null;
  private lastEventAt: string | null = null;
  private error: string | null = null;

  markConnected() {
    this.connectedAt = new Date().toISOString();
    this.error = null;
  }

  markDisconnected(message: string) {
    this.error = message;
  }

  record(event: SolanaTransactionEvent, config: SolanaMonitoringConfig) {
    this.events.unshift(event);
    this.events = this.events.slice(0, MAX_EVENTS);
    this.lastEventAt = event.timestamp;

    for (const account of event.accounts) {
      this.walletActivity.set(account, (this.walletActivity.get(account) ?? 0) + 1);
    }

    for (const transfer of event.tokenTransfers) {
      this.mintActivity.set(transfer.mint, (this.mintActivity.get(transfer.mint) ?? 0) + 1);
    }

    for (const programId of event.programIds) {
      this.programActivity.set(programId, (this.programActivity.get(programId) ?? 0) + 1);
    }

    for (const wallet of config.watchedWallets) {
      if (!this.walletActivity.has(wallet)) {
        this.walletActivity.set(wallet, 0);
      }
    }

    for (const mint of config.watchedMints) {
      if (!this.mintActivity.has(mint)) {
        this.mintActivity.set(mint, 0);
      }
    }

    for (const programId of config.dexPrograms) {
      if (!this.programActivity.has(programId)) {
        this.programActivity.set(programId, 0);
      }
    }
  }

  snapshot() {
    return {
      connectedAt: this.connectedAt,
      lastEventAt: this.lastEventAt,
      error: this.error,
      events: [...this.events],
      walletActivity: Object.fromEntries(this.walletActivity),
      mintActivity: Object.fromEntries(this.mintActivity),
      programActivity: Object.fromEntries(this.programActivity),
    };
  }
}
