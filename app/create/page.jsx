"use client";
import React, { useEffect, useState } from "react";
import SelectOption from "./_components/SelectOption";
import { Button } from "@/components/ui/button";
import TopicInput from "./_components/TopicInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardHeader from "../dashboard/_components/DashboardHeader";
import { FREE_COURSE_LIMIT } from "@/lib/constants";

function Create() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/user")
      .then((res) => {
        const profile = res.data.result;
        if (!profile?.isMember && profile?.courseCount >= FREE_COURSE_LIMIT) {
          toast.error("Free credit limit reached. Upgrade to continue.");
          router.replace("/dashboard/upgrade");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleUserInput = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const GenerateCourseOutline = async () => {
    if (!formData.courseType) {
      toast.error("Please choose a study type.");
      setStep(0);
      return;
    }
    if (!formData.topic?.trim() || !formData.difficultyLevel) {
      toast.error("Please enter a topic and difficulty level.");
      return;
    }

    const courseId = uuidv4();
    setLoading(true);
    try {
      await axios.post("/api/generate-course-outline", {
        courseId,
        ...formData,
      });
      toast.success("Your course is generating. Use Refresh on the dashboard.");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to generate course. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DashboardHeader />
      <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-10">
        <h2 className="font-bold text-4xl text-primary text-center">
          Start Building Your Personal Study Material
        </h2>
        <p className="text-gray-500 text-lg text-center">
          Fill all details in order to generate study material for your next project
        </p>

        <div className="mt-10 w-full max-w-4xl">
          {step == 0 ? (
            <SelectOption
              selectedStudyType={(value) => handleUserInput("courseType", value)}
            />
          ) : (
            <TopicInput
              setTopic={(value) => handleUserInput("topic", value)}
              setDifficultyLevel={(value) => handleUserInput("difficultyLevel", value)}
            />
          )}
        </div>

        <div className="flex justify-between w-full max-w-4xl mt-32">
          {step != 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          ) : (
            <span />
          )}
          {step == 0 ? (
            <Button
              onClick={() => {
                if (!formData.courseType) {
                  toast.error("Please choose a study type.");
                  return;
                }
                setStep(step + 1);
              }}
            >
              Next
            </Button>
          ) : (
            <Button onClick={GenerateCourseOutline} disabled={loading}>
              {loading ? <Loader className=" animate-spin" /> : "Generate"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Create;
