import { NextResponse } from "next/server";
import { requireBotToken } from "@/lib/api-auth";
import { monitoringBackend } from "@/lib/solana";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = monitoringBackend.snapshot();
  return NextResponse.json({
    watchedWallets: snapshot.watchedWallets,
    walletActivity: snapshot.walletActivity,
  });
}

export async function POST(request: Request) {
  const unauthorized = requireBotToken(request);
  if (unauthorized) {
    return unauthorized;
  }

  const body = (await request.json().catch(() => ({}))) as {
    wallets?: string[];
    add?: string[];
    remove?: string[];
  };

  const current = monitoringBackend.getConfig().watchedWallets;
  const next = body.wallets
    ? body.wallets
    : [...new Set([...current, ...(body.add ?? [])])].filter(
        (wallet) => !(body.remove ?? []).includes(wallet),
      );

  return NextResponse.json(monitoringBackend.updateConfig({ watchedWallets: next }));
}
