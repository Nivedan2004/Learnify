import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { normalizeFlashcards, normalizeQuiz } from "@/lib/studyContent";
import { requireAuthUser, requireCourseOwner } from "@/lib/currentUser";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, error } = await requireAuthUser();
  if (error) return error;

  const { courseId, studyType } = await req.json();
  if (!courseId || !studyType) {
    return NextResponse.json(
      { error: "courseId and studyType are required" },
      { status: 400 }
    );
  }

  const owned = await requireCourseOwner(courseId, email);
  if (owned.error) return owned.error;

  if (studyType === "ALL") {
    const notes = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

    const contentList = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));

    return NextResponse.json({
      notes,
      flashcard: contentList.filter((item) => item.type === "Flashcard"),
      quiz: contentList.filter((item) => item.type === "Quiz"),
    });
  }

  if (studyType === "notes") {
    const notes = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

    return NextResponse.json(notes);
  }

  const type = studyType === "flashcard" ? "Flashcard" : studyType;
  const result = await db
    .select()
    .from(STUDY_TYPE_CONTENT_TABLE)
    .where(
      and(
        eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
        eq(STUDY_TYPE_CONTENT_TABLE.type, type)
      )
    );

  const row = result[0];
  if (!row) {
    return NextResponse.json({});
  }

  if (row.type === "Flashcard") {
    return NextResponse.json({
      ...row,
      content: normalizeFlashcards(row.content),
    });
  }

  if (row.type === "Quiz") {
    return NextResponse.json({
      ...row,
      content: { questions: normalizeQuiz(row.content) },
    });
  }

  return NextResponse.json(row);
}
