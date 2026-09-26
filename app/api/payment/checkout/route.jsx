import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { getAppUrl } from "@/lib/appUrl";
import { getOrCreateDbUser, requireAuthUser } from "@/lib/currentUser";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  const { user, email, error } = await requireAuthUser();
  if (error) return error;

  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY) {
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { priceId } = await req.json();
  const dbUser = await getOrCreateDbUser(email, user.fullName);

  let customerId = dbUser.customerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      name: user.fullName || undefined,
    });
    customerId = customer.id;
    await db
      .update(USER_TABLE)
      .set({ customerId })
      .where(eq(USER_TABLE.email, email));
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
        quantity: 1,
      },
    ],
    success_url: getAppUrl("/payment-success?session_id={CHECKOUT_SESSION_ID}"),
    cancel_url: getAppUrl("/dashboard/upgrade"),
    client_reference_id: email,
  });

  return NextResponse.json(session);
}
