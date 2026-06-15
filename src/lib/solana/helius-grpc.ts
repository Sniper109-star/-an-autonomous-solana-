import Client, {
  type ClientDuplexStream,
  CommitmentLevel,
  type SubscribeRequest,
  type SubscribeUpdate,
} from "@triton-one/yellowstone-grpc";
import { extractAccountEvent, extractTransactionEvent } from "@/lib/solana/parser";
import type { SolanaMonitoringConfig, SolanaTransactionEvent } from "@/lib/solana/types";

export interface HeliusGrpcMonitorOptions {
  endpoint: string;
  apiKey: string;
  config: SolanaMonitoringConfig;
  onEvent?: (event: SolanaTransactionEvent) => void;
  onError?: (error: Error) => void;
}

const commitmentMap = {
  processed: CommitmentLevel.PROCESSED,
  confirmed: CommitmentLevel.CONFIRMED,
  finalized: CommitmentLevel.FINALIZED,
} as const;

export function createSubscribeRequest(config: SolanaMonitoringConfig): SubscribeRequest {
  const accountInclude = [
    ...config.watchedWallets,
    ...config.watchedMints,
    ...config.dexPrograms,
  ];

  return {
    accounts: {
      wallets: {
        account: config.watchedWallets,
        owner: [],
        filters: [],
      },
    },
    slots: {},
    transactions: {
      solana_activity: {
        vote: false,
        failed: config.includeFailed,
        signature: undefined,
        accountInclude,
        accountExclude: [],
        accountRequired: [],
      },
    },
    transactionsStatus: {},
    blocks: {},
    blocksMeta: {},
    entry: {},
    commitment: commitmentMap[config.commitment],
    accountsDataSlice: [],
  };
}

export class HeliusGrpcMonitor {
  private client: Client | null = null;
  private stream: ClientDuplexStream | null = null;
  private keepalive: NodeJS.Timeout | null = null;
  private readonly options: HeliusGrpcMonitorOptions;

  constructor(options: HeliusGrpcMonitorOptions) {
    this.options = options;
  }

  async connect() {
    if (!this.options.endpoint || !this.options.apiKey) {
      throw new Error("Helius gRPC endpoint and API key are required");
    }

    this.client = new Client(
      this.options.endpoint,
      this.options.apiKey,
      {
        "grpc.max_receive_message_length": 64 * 1024 * 1024,
      } as never,
      {
        enabled: true,
        backoff: {
          initialIntervalMs: 1000,
          multiplier: 1.6,
          maxRetries: 8,
        },
      },
    );

    await this.client.connect();
    this.stream = await this.client.subscribe(createSubscribeRequest(this.options.config));
    this.stream.on("data", (data: SubscribeUpdate) => this.handleUpdate(data));
    this.stream.on("error", (error: Error) => this.options.onError?.(error));
    this.stream.on("end", () => this.options.onError?.(new Error("Helius gRPC stream ended")));
    this.startKeepalive();
  }

  async health() {
    if (!this.client) {
      return { ok: false, message: "Helius gRPC client is not connected" };
    }

    try {
      const version = await this.client.getVersion();
      return { ok: true, version };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown Helius gRPC health error",
      };
    }
  }

  disconnect() {
    if (this.keepalive) {
      clearInterval(this.keepalive);
      this.keepalive = null;
    }

    if (this.stream) {
      this.stream.end();
      this.stream = null;
    }

    this.client = null;
  }

  private startKeepalive() {
    this.keepalive = setInterval(() => {
      if (!this.stream) {
        return;
      }

      this.stream.write({
        accounts: {},
        slots: {},
        transactions: {},
        transactionsStatus: {},
        blocks: {},
        blocksMeta: {},
        entry: {},
        commitment: commitmentMap[this.options.config.commitment],
        accountsDataSlice: [],
        ping: { id: Date.now() },
      });
    }, 30_000);
  }

  private handleUpdate(data: SubscribeUpdate) {
    if (data.transaction?.transaction) {
      const event = extractTransactionEvent(data.transaction, this.options.config);
      this.options.onEvent?.(event);
      return;
    }

    if (data.account?.account) {
      const event = extractAccountEvent(data.account, this.options.config);
      this.options.onEvent?.(event);
    }
  }
}
