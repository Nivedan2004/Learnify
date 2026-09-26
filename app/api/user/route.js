import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import { FREE_COURSE_LIMIT } from "@/lib/constants";
import { getCourseCount, getOrCreateDbUser, requireAuthUser } from "@/lib/currentUser";

export async function GET() {
  const { user, email, error } = await requireAuthUser();
  if (error) return error;

  const dbUser = await getOrCreateDbUser(email, user.fullName);
  const courseCount = await getCourseCount(email);

  return NextResponse.json({
    result: {
      ...dbUser,
      courseCount,
      creditLimit: dbUser?.isMember ? null : FREE_COURSE_LIMIT,
      remainingCredits: dbUser?.isMember
        ? null
        : Math.max(FREE_COURSE_LIMIT - courseCount, 0),
    },
  });
}
