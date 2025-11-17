// lib/session-app.ts
import { NextRequest } from "next/server";
import { getSession as getOldSession, SessionData } from "./session";

// App Router wrapper
export async function getSession(req: NextRequest): Promise<SessionData> {
  // Use a fake res object for App Router
  const res = {} as any;
  return getOldSession(req as any, res);
}

// Re-export type properly for TS isolatedModules
export type { SessionData };
