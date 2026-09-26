import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import {
  CHAPTER_NOTES_TABLE,
  STUDY_MATERIAL_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
} from "@/configs/schema";
import { and, desc, eq } from "drizzle-orm";
import { requireAuthUser, requireCourseOwner } from "@/lib/currentUser";

export async function POST() {
  const { email, error } = await requireAuthUser();
  if (error) return error;

  const result = await db
    .select()
    .from(STUDY_MATERIAL_TABLE)
    .where(eq(STUDY_MATERIAL_TABLE.createdBy, email))
    .orderBy(desc(STUDY_MATERIAL_TABLE.id));

  return NextResponse.json({ result });
}

export async function GET(req) {
  const { email, error } = await requireAuthUser();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const owned = await requireCourseOwner(courseId, email);
  if (owned.error) return owned.error;

  return NextResponse.json({ result: owned.course });
}

export async function DELETE(req) {
  const { email, error } = await requireAuthUser();
  if (error) return error;

  const { courseId } = await req.json();
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const owned = await requireCourseOwner(courseId, email);
  if (owned.error) return owned.error;

  await db
    .delete(CHAPTER_NOTES_TABLE)
    .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));
  await db
    .delete(STUDY_TYPE_CONTENT_TABLE)
    .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));
  await db
    .delete(STUDY_MATERIAL_TABLE)
    .where(
      and(
        eq(STUDY_MATERIAL_TABLE.courseId, courseId),
        eq(STUDY_MATERIAL_TABLE.createdBy, email)
      )
    );

  return NextResponse.json({ result: "deleted" });
}
