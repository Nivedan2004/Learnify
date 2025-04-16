import { CreateNewUSer, helloWorld, GenerateNotes, GenerateStudyTypeContent } from "@/inngest/functions";
import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    CreateNewUSer,
    GenerateNotes,
    GenerateStudyTypeContent
    /* your functions will be passed here later! */
  ],
});