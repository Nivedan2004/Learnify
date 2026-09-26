"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterialSection from "./_components/StudyMaterialSection";
import ChapterList from "./_components/ChapterList";
import { toast } from "sonner";

function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetCourse();
  }, [courseId]);

  const GetCourse = async () => {
    try {
      const result = await axios.get("/api/courses?courseId=" + courseId);
      setCourse(result.data.result);
    } catch (error) {
      toast.error("Could not load this course.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-64 bg-slate-100 animate-pulse rounded-lg" />;
  }

  if (!course) {
    return (
      <div className="text-center py-20 text-gray-500">
        This course could not be found.
      </div>
    );
  }

  return (
    <div>
      <CourseIntroCard course={course} />
      <StudyMaterialSection courseId={courseId} course={course} />
      <ChapterList course={course} courseId={courseId} />
    </div>
  );
}

export default Course;
