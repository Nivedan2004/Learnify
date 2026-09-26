import { courseOutlineAIModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { FREE_COURSE_LIMIT } from "@/lib/constants";
import { parseAiJson } from "@/lib/parseAiJson";
import {
  getCourseCount,
  getOrCreateDbUser,
  requireAuthUser,
} from "@/lib/currentUser";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req) {
  const { user, email, error } = await requireAuthUser();
  if (error) return error;

  const body = await req.json();
  const { courseId, topic, courseType, difficultyLevel } = body;

  if (!courseId || !topic?.trim() || !courseType || !difficultyLevel) {
    return NextResponse.json(
      { error: "Please complete all course details before generating." },
      { status: 400 }
    );
  }

  const dbUser = await getOrCreateDbUser(email, user.fullName);
  const courseCount = await getCourseCount(email);

  if (!dbUser?.isMember && courseCount >= FREE_COURSE_LIMIT) {
    return NextResponse.json(
      { error: "Free credit limit reached. Upgrade to create more courses." },
      { status: 403 }
    );
  }

  const prompt = `Generate a study material for "${topic}" for ${courseType} at ${difficultyLevel} difficulty.
Return JSON only with this shape:
{
  "course_title": string,
  "course_summary": string,
  "chapters": [
    {
      "chapter_number": number,
      "chapter_title": string,
      "chapter_summary": string,
      "emoji": string,
      "topics": [{ "topic": string, "description": string }]
    }
  ]
}
Include at most 3 chapters.`;

  try {
    const aiResp = await courseOutlineAIModel.sendMessage(prompt);
    const aiResult = parseAiJson(aiResp.response.text());

    const dbResult = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values({
        courseId,
        courseType,
        createdBy: email,
        topic: topic.trim(),
        difficultyLevel,
        courseLayout: aiResult,
        status: "Generating",
      })
      .returning();

    await inngest.send({
      name: "notes.generate",
      data: {
        course: dbResult[0],
      },
    });

    return NextResponse.json({ result: dbResult[0] });
  } catch (err) {
    console.error("Course outline generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate course. Please try again." },
      { status: 500 }
    );
  }
}
