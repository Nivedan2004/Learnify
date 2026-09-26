import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { requireAuthUser, requireCourseOwner } from "@/lib/currentUser";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = ["Flashcard", "Quiz"];

export async function POST(req) {
  const { email, error } = await requireAuthUser();
  if (error) return error;

  const { chapters, courseId, type } = await req.json();

  if (!courseId || !ALLOWED_TYPES.includes(type)) {
    return NextResponse.json(
      { error: "A valid course and study type are required" },
      { status: 400 }
    );
  }

  const owned = await requireCourseOwner(courseId, email);
  if (owned.error) return owned.error;

  const existing = await db
    .select()
    .from(STUDY_TYPE_CONTENT_TABLE)
    .where(
      and(
        eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
        eq(STUDY_TYPE_CONTENT_TABLE.type, type)
      )
    );

  if (existing[0]?.status === "Ready") {
    return NextResponse.json({ id: existing[0].id, status: "Ready" });
  }

  const prompt =
    type === "Flashcard"
      ? `Generate flashcards on these topics: ${chapters}. Return JSON array only, maximum 15 items, each with "front" and "back" string fields.`
      : `Generate a quiz on these topics: ${chapters}. Return JSON only as {"questions":[{"question":string,"options":[string,string,string,string],"answer":string}]} with maximum 10 questions.`;

  let recordId = existing[0]?.id;
  if (!recordId) {
    const inserted = await db
      .insert(STUDY_TYPE_CONTENT_TABLE)
      .values({
        courseId,
        type,
        status: "Generating",
      })
      .returning({ id: STUDY_TYPE_CONTENT_TABLE.id });
    recordId = inserted[0].id;
  } else {
    await db
      .update(STUDY_TYPE_CONTENT_TABLE)
      .set({ status: "Generating" })
      .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));
  }

  await inngest.send({
    name: "studyType.content",
    data: {
      studyType: type,
      prompt,
      courseId,
      recordId,
    },
  });

  return NextResponse.json({ id: recordId, status: "Generating" });
}
