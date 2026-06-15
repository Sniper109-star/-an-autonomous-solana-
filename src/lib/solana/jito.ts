import fs from "node:fs";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { Bundle } from "jito-ts/dist/sdk/block-engine/types";
import { searcherClient } from "jito-ts/dist/sdk/block-engine/searcher";
import { isError } from "jito-ts/dist/sdk/block-engine/utils";

export interface JitoMonitorOptions {
  blockEngineUrl: string;
  authKeypairPath: string;
  rpcUrl: string;
  tipLamports: number;
}

export interface JitoHealth {
  enabled: boolean;
  blockEngineConfigured: boolean;
  authKeypairConfigured: boolean;
  tipAccounts?: string[];
  nextLeader?: {
    currentSlot: number;
    nextLeaderSlot: number;
    nextLeaderIdentity: string;
  };
  error?: string;
}

export class JitoMonitor {
  private readonly options: JitoMonitorOptions;

  constructor(options: JitoMonitorOptions) {
    this.options = options;
  }

  async health(): Promise<JitoHealth> {
    const blockEngineConfigured = this.options.blockEngineUrl.length > 0;
    const authKeypairConfigured = this.options.authKeypairPath.length > 0;

    if (!blockEngineConfigured || !authKeypairConfigured) {
      return {
        enabled: false,
        blockEngineConfigured,
        authKeypairConfigured,
        error: "Jito bundle submission requires JITO_BLOCK_ENGINE_URL and JITO_AUTH_KEYPAIR_PATH",
      };
    }

    try {
      const client = searcherClient(this.options.blockEngineUrl, loadKeypair(this.options.authKeypairPath));
      const tipAccountsResult = await client.getTipAccounts();
      const leaderResult = await client.getNextScheduledLeader();

      if (!tipAccountsResult.ok) {
        return {
          enabled: false,
          blockEngineConfigured,
          authKeypairConfigured,
          error: tipAccountsResult.error.message,
        };
      }

      if (!leaderResult.ok) {
        return {
          enabled: false,
          blockEngineConfigured,
          authKeypairConfigured,
          error: leaderResult.error.message,
        };
      }

      return {
        enabled: true,
        blockEngineConfigured,
        authKeypairConfigured,
        tipAccounts: tipAccountsResult.value,
        nextLeader: leaderResult.value,
      };
    } catch (error) {
      return {
        enabled: false,
        blockEngineConfigured,
        authKeypairConfigured,
        error: error instanceof Error ? error.message : "Unknown Jito health error",
      };
    }
  }

  async submitBundle(transactions: VersionedTransaction[]) {
    if (!this.options.authKeypairPath) {
      throw new Error("JITO_AUTH_KEYPAIR_PATH is required for bundle submission");
    }

    const keypair = loadKeypair(this.options.authKeypairPath);
    const client = searcherClient(this.options.blockEngineUrl, keypair);
    const bundle = new Bundle(transactions, Math.max(transactions.length, 1));
    const result = bundle.addTransactions(...transactions);

    if (isError(result)) {
      throw result;
    }

    const tipAccountsResult = await client.getTipAccounts();
    if (!tipAccountsResult.ok || tipAccountsResult.value.length === 0) {
      throw new Error("Jito tip accounts are unavailable");
    }

    const connection = new Connection(this.options.rpcUrl, "confirmed");
    const blockhash = await connection.getLatestBlockhash();
    const withTip = result.addTipTx(
      keypair,
      this.options.tipLamports,
      new PublicKey(tipAccountsResult.value[0]),
      blockhash.blockhash,
    );

    if (isError(withTip)) {
      throw withTip;
    }

    return client.sendBundle(withTip);
  }

  async buildMemoBundle(message: string) {
    if (!this.options.authKeypairPath) {
      throw new Error("JITO_AUTH_KEYPAIR_PATH is required to build a Jito memo bundle");
    }

    const keypair = loadKeypair(this.options.authKeypairPath);
    const client = searcherClient(this.options.blockEngineUrl, keypair);
    const connection = new Connection(this.options.rpcUrl, "confirmed");
    const tipAccountsResult = await client.getTipAccounts();
    if (!tipAccountsResult.ok || tipAccountsResult.value.length === 0) {
      throw new Error("Jito tip accounts are unavailable");
    }

    const blockhash = await connection.getLatestBlockhash();
    const memoInstruction = new TransactionInstruction({
      keys: [{ pubkey: keypair.publicKey, isSigner: true, isWritable: true }],
      programId: new PublicKey("Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo"),
      data: Buffer.from(message),
    });
    const tipInstruction = SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: new PublicKey(tipAccountsResult.value[0]),
      lamports: this.options.tipLamports,
    });
    const messageOne = new TransactionMessage({
      payerKey: keypair.publicKey,
      recentBlockhash: blockhash.blockhash,
      instructions: [memoInstruction],
    }).compileToV0Message();
    const messageTwo = new TransactionMessage({
      payerKey: keypair.publicKey,
      recentBlockhash: blockhash.blockhash,
      instructions: [tipInstruction],
    }).compileToV0Message();
    const first = new VersionedTransaction(messageOne);
    const second = new VersionedTransaction(messageTwo);
    first.sign([keypair]);
    second.sign([keypair]);

    return [first, second];
  }
}

function loadKeypair(path: string) {
  const raw = fs.readFileSync(path, "utf8");
  const secretKey = Uint8Array.from(JSON.parse(raw) as number[]);
  return Keypair.fromSecretKey(secretKey);
}
