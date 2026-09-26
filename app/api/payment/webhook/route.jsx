import { db } from "@/configs/db";
import { PAYMENT_RECORD_TABLE, USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

async function markMember({ email, customerId, sessionId }) {
  if (email) {
    await db
      .update(USER_TABLE)
      .set({
        isMember: true,
        ...(customerId ? { customerId } : {}),
      })
      .where(eq(USER_TABLE.email, email));
  } else if (customerId) {
    await db
      .update(USER_TABLE)
      .set({ isMember: true })
      .where(eq(USER_TABLE.customerId, customerId));
  }

  if (sessionId || customerId) {
    await db.insert(PAYMENT_RECORD_TABLE).values({
      customerId: customerId || null,
      sessionId: sessionId || null,
    });
  }
}

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEB_HOOK_KEY;
  const body = await req.text();

  let event;
  if (webhookSecret) {
    const signature = req.headers.get("stripe-signature");
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    event = JSON.parse(body);
  }

  const data = event.data?.object || {};

  switch (event.type) {
    case "checkout.session.completed":
      await markMember({
        email: data.customer_details?.email || data.customer_email,
        customerId: typeof data.customer === "string" ? data.customer : data.customer?.id,
        sessionId: data.id,
      });
      break;
    case "invoice.paid":
      await markMember({
        email: data.customer_email,
        customerId: typeof data.customer === "string" ? data.customer : undefined,
        sessionId: data.id,
      });
      break;
    case "customer.subscription.deleted":
      await db
        .update(USER_TABLE)
        .set({ isMember: false })
        .where(
          eq(
            USER_TABLE.customerId,
            typeof data.customer === "string" ? data.customer : data.customer?.id
          )
        );
      break;
    case "invoice.payment_failed":
      if (data.customer_email) {
        await db
          .update(USER_TABLE)
          .set({ isMember: false })
          .where(eq(USER_TABLE.email, data.customer_email));
      }
      break;
    default:
      break;
  }

  return NextResponse.json({ result: "success" });
}
