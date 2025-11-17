// src/app/api/session-cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession, SessionData } from "@/lib/session-app";

export async function GET(req: NextRequest) {
  const session: SessionData = await getSession(req);

  if (!session.cart) session.cart = [];
  if (!session.savedItems) session.savedItems = [];

  return NextResponse.json({ cart: session.cart, savedItems: session.savedItems });
}

export async function POST(req: NextRequest) {
  const session: SessionData = await getSession(req);
  if (!session.cart) session.cart = [];

  const body = await req.json();
  session.cart.push(body); // add item
  return NextResponse.json({ success: true, cart: session.cart });
}

export async function PUT(req: NextRequest) {
  const session: SessionData = await getSession(req);
  if (!session.cart) session.cart = [];

  const body = await req.json();
  const item = session.cart.find(i => i.id === body.id);
  if (item) item.quantity = body.quantity;

  return NextResponse.json({ success: true, cart: session.cart });
}

export async function DELETE(req: NextRequest) {
  const session: SessionData = await getSession(req);
  const url = new URL(req.url);
  const id = Number(url.pathname.split("/").pop());

  session.cart = session.cart?.filter(i => i.id !== id);
  return NextResponse.json({ success: true, cart: session.cart });
}
