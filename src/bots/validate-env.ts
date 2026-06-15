import { getBotEnvironment } from "@/lib/env";

const env = getBotEnvironment();

console.log(JSON.stringify({
  ok: env.missingRequired.length === 0,
  missingRequired: env.missingRequired,
  warnings: env.warnings,
  config: env.config,
  grpc: {
    endpointConfigured: env.heliusGrpcEndpoint.length > 0,
    apiKeyConfigured: env.heliusApiKey.length > 0,
  },
  jito: {
    blockEngineConfigured: env.jitoBlockEngineUrl.length > 0,
    authKeypairConfigured: env.jitoAuthKeypairPath.length > 0,
    tipLamports: env.jitoTipLamports,
  },
}, null, 2));

process.exit(env.missingRequired.length > 0 ? 1 : 0);
