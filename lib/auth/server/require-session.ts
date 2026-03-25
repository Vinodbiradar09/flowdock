import "server-only";
import { UnauthorizedError } from "@/lib/error/http-errors";
import type { AuthSession } from "./auth";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function requireSession(): Promise<AuthSession> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new UnauthorizedError();
  }

  return session;
}
