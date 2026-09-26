import { getAppUrl } from "@/lib/appUrl";
import { getOrCreateDbUser, requireAuthUser } from "@/lib/currentUser";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  const { user, email, error } = await requireAuthUser();
  if (error) return error;

  const dbUser = await getOrCreateDbUser(email, user.fullName);
  if (!dbUser?.customerId) {
    return NextResponse.json(
      { error: "No billing account found for this user." },
      { status: 400 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: dbUser.customerId,
    return_url: getAppUrl("/dashboard/upgrade"),
  });

  return NextResponse.json(portalSession);
}
