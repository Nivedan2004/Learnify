"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

function CourseCardItem({ course, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const title =
    course?.courseLayout?.course_title ||
    course?.courseLayout?.courseTitle ||
    course?.topic;
  const summary =
    course?.courseLayout?.course_summary ||
    course?.courseLayout?.courseSummary ||
    "";
  const progress = course?.status === "Ready" ? 100 : course?.status === "Failed" ? 0 : 40;

  const handleDelete = async () => {
    if (!confirm("Delete this course and all of its study material?")) return;
    setDeleting(true);
    try {
      await axios.delete("/api/courses", { data: { courseId: course?.courseId } });
      toast.success("Course deleted");
      onDeleted?.();
    } catch (error) {
      toast.error("Could not delete this course.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-5">
      <div>
        <div className="flex justify-between items-center">
          <Image src={"/knowledge.png"} alt="other" width={50} height={50} />
          <h2 className="text-[10px] p-1 px-2 rounded-full bg-primary text-white">
            {course?.courseType || "Course"}
          </h2>
        </div>
        <h2 className="mt-3 font-medium text-lg">{title}</h2>
        <p className="text-sm  line-clamp-2 text-gray-500 mt-2">{summary}</p>

        <div className="mt-3">
          <Progress value={progress} />
        </div>
        <div className="mt-3 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            disabled={deleting}
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {course?.status == "Generating" ? (
            <h2 className="text-sm p-1 px-2 flex gap-2 items-center rounded-full bg-gray-700 text-white">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Generating...
            </h2>
          ) : course?.status == "Failed" ? (
            <h2 className="text-sm p-1 px-2 rounded-full bg-red-100 text-red-600">
              Failed
            </h2>
          ) : (
            <Link href={"/course/" + course?.courseId}>
              <Button className="cursor-pointer">View</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCardItem;
