import { db } from "@/configs/db";
import {
  CHAPTER_NOTES_TABLE,
  STUDY_MATERIAL_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
  USER_TABLE,
} from "@/configs/schema";
import {
  generateNotesAiModel,
  GenerateQuizAiModel,
  GenerateStudyTypeContentAiModel,
} from "@/configs/AiModel";
import { parseAiJson } from "@/lib/parseAiJson";
import { eq } from "drizzle-orm";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const CreateNewUSer = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    const { user } = event.data;
    await step.run("Check user and create new if not in database", async () => {
      const result = await db
        .select()
        .from(USER_TABLE)
        .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));

      if (result?.length == 0) {
        return await db
          .insert(USER_TABLE)
          .values({
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
          })
          .returning({ id: USER_TABLE.id });
      }
      return result;
    });

    return "Success";
  }
);

export const GenerateNotes = inngest.createFunction(
  { id: "generate-course", retries: 2 },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { course } = event.data;
    const chapters = course?.courseLayout?.chapters || [];

    try {
      await step.run("Generate Chapter Notes", async () => {
        let index = 0;
        for (const chapter of chapters) {
          const prompt = `Generate ${course?.courseType} study notes as HTML only (no html/head/body/title tags, no markdown).
Use h1/h2/h3/p/ul/li/pre tags with inline styles. Cover every topic. Chapter: ${JSON.stringify(chapter)}`;
          const result = await generateNotesAiModel.sendMessage(prompt);
          const aiResp = result.response.text();
          await db.insert(CHAPTER_NOTES_TABLE).values({
            chapterId: index,
            courseId: course?.courseId,
            notes: aiResp,
          });
          index += 1;
        }
        return chapters.length;
      });

      await step.run("Update Course Status to Ready", async () => {
        await db
          .update(STUDY_MATERIAL_TABLE)
          .set({ status: "Ready" })
          .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));
        return "Success";
      });
    } catch (error) {
      await db
        .update(STUDY_MATERIAL_TABLE)
        .set({ status: "Failed" })
        .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));
      throw error;
    }
  }
);

export const GenerateStudyTypeContent = inngest.createFunction(
  { id: "Generate Study Type Content", retries: 2 },
  { event: "studyType.content" },
  async ({ event, step }) => {
    const { studyType, prompt, recordId } = event.data;

    try {
      const AiResult = await step.run("Generating study content using AI", async () => {
        const result =
          studyType == "Flashcard"
            ? await GenerateStudyTypeContentAiModel.sendMessage(prompt)
            : await GenerateQuizAiModel.sendMessage(prompt);
        return parseAiJson(result.response.text());
      });

      await step.run("Save Result to DB", async () => {
        await db
          .update(STUDY_TYPE_CONTENT_TABLE)
          .set({
            content: AiResult,
            status: "Ready",
          })
          .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));
        return "Data Inserted";
      });
    } catch (error) {
      await db
        .update(STUDY_TYPE_CONTENT_TABLE)
        .set({ status: "Failed" })
        .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));
      throw error;
    }
  }
);
