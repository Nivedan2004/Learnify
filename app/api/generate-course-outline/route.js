import { courseOutlineAIModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";

export async function POST(req){

    const{courseId,topic,courseType,difficultyLevel,createdBy}=await req.json();

    const PROMPT='Generate a study material for '+topic+' for '+courseType+' and level of difficulty will be '+difficultyLevel+'with summary of course, List of Chapters (Max 3) along with summary and Emoji icon for each chapter, Topic list in each chapter, and all result in JSON format '
    //Generate Course Layout using ai
    const aiResp=await courseOutlineAIModel.sendMessage(PROMPT);
    const aiResult= JSON.parse(aiResp.response.text());

    //Save the result along with User Input 
    const dbResult=await db.insert(STUDY_MATERIAL_TABLE).values({
        courseId:courseId,
        courseType:courseType,
        createdBy:createdBy,
        topic:topic,
        courseLayout:aiResult
    }).returning({resp:STUDY_MATERIAL_TABLE})

    return NextResponse.json({result:dbResult[0]})
}