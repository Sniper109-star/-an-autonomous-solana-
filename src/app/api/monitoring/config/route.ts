import { NextResponse } from "next/server";
import { requireBotToken } from "@/lib/api-auth";
import { monitoringBackend } from "@/lib/solana";
import type { SolanaMonitoringConfig } from "@/lib/solana/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(monitoringBackend.getConfig());
}

export async function POST(request: Request) {
  const unauthorized = requireBotToken(request);
  if (unauthorized) {
    return unauthorized;
  }

  const body = (await request.json().catch(() => ({}))) as Partial<SolanaMonitoringConfig>;
  return NextResponse.json(monitoringBackend.updateConfig(body));
}
