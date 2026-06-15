import { getBotEnvironment } from "@/lib/env";
import { monitoringBackend } from "@/lib/solana";

async function main() {
  const env = getBotEnvironment();
  const snapshot = monitoringBackend.snapshot();
  const health = await monitoringBackend.health();

  console.log(JSON.stringify({
    environmentOk: env.missingRequired.length === 0,
    missingRequired: env.missingRequired,
    warnings: env.warnings,
    snapshot,
    health,
  }, null, 2));

  process.exit(env.missingRequired.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
