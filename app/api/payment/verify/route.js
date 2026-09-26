import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { requireAuthUser } from "@/lib/currentUser";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  const { email, error } = await requireAuthUser();
  if (error) return error;

  const { sessionId } = await req.json();
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ error: "Payment not complete" }, { status: 400 });
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  await db
    .update(USER_TABLE)
    .set({
      isMember: true,
      ...(customerId ? { customerId } : {}),
    })
    .where(eq(USER_TABLE.email, email));

  return NextResponse.json({ result: "success", isMember: true });
}
