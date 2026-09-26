import Image from "next/image";
import React from "react";
import { Progress } from "@/components/ui/progress";

function CourseIntroCard({ course }) {
  const title =
    course?.courseLayout?.course_title ||
    course?.courseLayout?.courseTitle ||
    course?.topic;
  const summary =
    course?.courseLayout?.course_summary ||
    course?.courseLayout?.courseSummary ||
    "";

  return (
    <div className="flex gap-5 items-center p-10 border shadow-md rounded-lg">
      <Image src={"/knowledge.png"} alt="other" width={70} height={70} />
      <div>
        <h2 className="font-bold text-2xl">{title}</h2>
        <p>{summary}</p>
        <Progress className="mt-3" value={course?.status === "Ready" ? 100 : 40} />
        <h2 className="mt-3 text-lg text-primary">
          Total Chapters : {course?.courseLayout?.chapters?.length || 0}
        </h2>
      </div>
    </div>
  );
}

export default CourseIntroCard;
