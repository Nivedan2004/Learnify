"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import CourseCardItem from "./CourseCardItem";
import { CourseCountContext } from "@/app/_context/CourseCountContext";
import Link from "next/link";
import { toast } from "sonner";

function CourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setTotalCourse, setIsMember } = useContext(CourseCountContext);

  useEffect(() => {
    if (user) GetCourseList();
  }, [user]);

  const GetCourseList = async () => {
    setLoading(true);
    try {
      const [courses, profile] = await Promise.all([
        axios.post("/api/courses"),
        axios.get("/api/user"),
      ]);
      setCourseList(courses.data.result || []);
      setTotalCourse(courses.data.result?.length || 0);
      setIsMember(Boolean(profile.data.result?.isMember));
    } catch (error) {
      toast.error("Could not load your courses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl flex justify-between items-center">
        Your Courses
        <Button
          variant="outline"
          onClick={GetCourseList}
          className="border-primary text-primary"
        >
          <RefreshCw /> Refresh
        </Button>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-5">
        {loading == false
          ? courseList?.map((course, index) => (
              <CourseCardItem
                course={course}
                key={course?.courseId || index}
                onDeleted={GetCourseList}
              />
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={index}
                className="h-56 w-full bg-slate-200 rounded-lg animate-pulse"
              ></div>
            ))}
      </div>

      {!loading && courseList.length === 0 && (
        <div className="mt-10 border rounded-lg p-10 text-center text-gray-500">
          <h3 className="font-medium text-lg text-gray-800">No courses yet</h3>
          <p className="mt-2">Create your first AI study course to get started.</p>
          <Link href="/create">
            <Button className="mt-5">+ Create New</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default CourseList;
