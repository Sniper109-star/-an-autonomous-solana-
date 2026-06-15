import { getBotEnvironment } from "@/lib/env";
import { HeliusGrpcMonitor } from "@/lib/solana/helius-grpc";
import { JitoMonitor } from "@/lib/solana/jito";
import { SolanaEventStore } from "@/lib/solana/store";
import type { BotStatus, MonitoringSnapshot, SolanaMonitoringConfig } from "@/lib/solana/types";

export class SolanaMonitoringBackend {
  private config = getBotEnvironment().config;
  private store = new SolanaEventStore();
  private grpc: HeliusGrpcMonitor | null = null;
  private jito = new JitoMonitor({
    blockEngineUrl: getBotEnvironment().jitoBlockEngineUrl,
    authKeypairPath: getBotEnvironment().jitoAuthKeypairPath,
    rpcUrl: getBotEnvironment().heliusRpcUrl,
    tipLamports: getBotEnvironment().jitoTipLamports,
  });
  private status: BotStatus = "idle";
  private error: string | null = null;

  async start() {
    if (this.status === "running" || this.status === "starting") {
      return this.snapshot();
    }

    const env = getBotEnvironment();
    this.config = env.config;
    this.status = "starting";
    this.error = null;

    if (env.missingRequired.length > 0) {
      this.status = "error";
      this.error = `Missing required environment variables: ${env.missingRequired.join(", ")}`;
      return this.snapshot();
    }

    this.grpc = new HeliusGrpcMonitor({
      endpoint: env.heliusGrpcEndpoint,
      apiKey: env.heliusApiKey,
      config: this.config,
      onEvent: (event) => this.store.record(event, this.config),
      onError: (error) => {
        this.error = error.message;
        this.store.markDisconnected(error.message);
      },
    });

    try {
      await this.grpc.connect();
      this.store.markConnected();
      this.status = "running";
    } catch (error) {
      this.status = "error";
      this.error = error instanceof Error ? error.message : "Unable to start Helius gRPC monitor";
      this.store.markDisconnected(this.error);
    }

    return this.snapshot();
  }

  async stop() {
    this.status = "stopping";
    this.grpc?.disconnect();
    this.grpc = null;
    this.status = "idle";
    this.store.markDisconnected("Monitoring stopped");
    return this.snapshot();
  }

  updateConfig(config: Partial<SolanaMonitoringConfig>) {
    this.config = {
      ...this.config,
      ...config,
    };

    if (this.status === "running") {
      void this.stop().then(() => this.start());
    }

    return this.snapshot();
  }

  getConfig() {
    return { ...this.config };
  }

  async health() {
    const env = getBotEnvironment();
    const [grpcHealth, jitoHealth] = await Promise.all([
      this.grpc?.health() ?? {
        ok: false,
        message: env.heliusGrpcEndpoint ? "Helius gRPC monitor is not connected" : "Helius gRPC endpoint is not configured",
      },
      this.jito.health(),
    ]);

    return {
      status: this.status,
      error: this.error,
      grpc: grpcHealth,
      jito: jitoHealth,
      environment: {
        missingRequired: env.missingRequired,
        warnings: env.warnings,
      },
    };
  }

  snapshot(): MonitoringSnapshot {
    const env = getBotEnvironment();
    const store = this.store.snapshot();

    return {
      status: this.status,
      connectedAt: store.connectedAt,
      lastEventAt: store.lastEventAt,
      error: this.error ?? store.error,
      watchedWallets: this.config.watchedWallets,
      watchedMints: this.config.watchedMints,
      dexPrograms: this.config.dexPrograms,
      events: store.events,
      walletActivity: store.walletActivity,
      mintActivity: store.mintActivity,
      programActivity: store.programActivity,
      grpc: {
        enabled: this.status === "running",
        endpointConfigured: env.heliusGrpcEndpoint.length > 0,
        apiKeyConfigured: env.heliusApiKey.length > 0,
        subscription: this.config.watchedWallets.length > 0 || this.config.watchedMints.length > 0
          ? "transactions"
          : "accounts",
      },
      jito: {
        enabled: env.jitoAuthKeypairPath.length > 0,
        blockEngineConfigured: env.jitoBlockEngineUrl.length > 0,
        authKeypairConfigured: env.jitoAuthKeypairPath.length > 0,
        tipLamports: env.jitoTipLamports,
      },
    };
  }
}

export const monitoringBackend = new SolanaMonitoringBackend();
