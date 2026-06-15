import { NextResponse } from "next/server";
import { getBotEnvironment } from "@/lib/env";

export function requireBotToken(request: Request) {
  const token = getBotEnvironment().botApiToken;

  if (!token) {
    return null;
  }

  const authorization = request.headers.get("authorization") ?? "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7) : authorization;

  if (bearer !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
