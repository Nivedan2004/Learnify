import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE, USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function requireAuthUser() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!user || !email) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, email };
}

export async function getOrCreateDbUser(email, name) {
  const existing = await db
    .select()
    .from(USER_TABLE)
    .where(eq(USER_TABLE.email, email));

  if (existing.length > 0) {
    return existing[0];
  }

  const created = await db
    .insert(USER_TABLE)
    .values({
      name: name || "Learner",
      email,
    })
    .returning();

  return created[0];
}

export async function getCourseCount(email) {
  const courses = await db
    .select()
    .from(STUDY_MATERIAL_TABLE)
    .where(eq(STUDY_MATERIAL_TABLE.createdBy, email));

  return courses.length;
}

export async function requireCourseOwner(courseId, email) {
  const course = await db
    .select()
    .from(STUDY_MATERIAL_TABLE)
    .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

  if (!course[0] || course[0].createdBy !== email) {
    return {
      error: NextResponse.json({ error: "Course not found" }, { status: 404 }),
    };
  }

  return { course: course[0] };
}
