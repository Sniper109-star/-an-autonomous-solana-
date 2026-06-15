import { getBotEnvironment } from "@/lib/env";
import { monitoringBackend } from "@/lib/solana";

async function main() {
  const env = getBotEnvironment();

  if (env.missingRequired.length > 0) {
    console.error(`Missing required environment variables: ${env.missingRequired.join(", ")}`);
    process.exit(1);
  }

  for (const warning of env.warnings) {
    console.warn(warning);
  }

  const snapshot = await monitoringBackend.start();

  if (snapshot.status !== "running") {
    console.error(snapshot.error ?? "Unable to start Solana monitoring backend");
    process.exit(1);
  }

  console.log(JSON.stringify({ status: "running", snapshot }, null, 2));

  const shutdown = async () => {
    await monitoringBackend.stop();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown());
  process.on("SIGTERM", () => void shutdown());

  await new Promise(() => undefined);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
