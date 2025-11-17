// lib/session.ts
import withSession from "next-session";
import { IncomingMessage, ServerResponse } from "http";

export interface SessionData {
  userId?: number;
  cart?: { id: number; title: string; price: number; offerPrice?: number; quantity: number; [key: string]: any }[];
  savedItems?: { id: number; title: string; price: number; quantity: number; [key: string]: any }[];
  [key: string]: any;
}

export const session = withSession({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60, // 1 day
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  },
});

// Original helper — takes IncomingMessage + ServerResponse
export async function getSession(req: IncomingMessage, res: ServerResponse) {
  return (await session(req, res)) as SessionData;
}
