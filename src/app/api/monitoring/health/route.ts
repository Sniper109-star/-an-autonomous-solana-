import { NextResponse } from "next/server";
import { monitoringBackend } from "@/lib/solana";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await monitoringBackend.health());
}
