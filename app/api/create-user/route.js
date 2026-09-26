import { NextResponse } from "next/server";
import { getOrCreateDbUser, requireAuthUser } from "@/lib/currentUser";

export async function POST() {
  const { user, email, error } = await requireAuthUser();
  if (error) return error;

  const dbUser = await getOrCreateDbUser(email, user.fullName);
  return NextResponse.json({ result: dbUser });
}

export async function GET() {
  const { user, email, error } = await requireAuthUser();
  if (error) return error;

  const dbUser = await getOrCreateDbUser(email, user.fullName);
  return NextResponse.json({ result: dbUser });
}
