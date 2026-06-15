import { NextResponse } from "next/server";
import { requireBotToken } from "@/lib/api-auth";
import { monitoringBackend } from "@/lib/solana";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(monitoringBackend.snapshot());
}

export async function POST(request: Request) {
  const unauthorized = requireBotToken(request);
  if (unauthorized) {
    return unauthorized;
  }

  const body = (await request.json().catch(() => ({}))) as { action?: string };

  if (body.action === "stop") {
    return NextResponse.json(await monitoringBackend.stop());
  }

  return NextResponse.json(await monitoringBackend.start());
}
