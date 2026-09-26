"use client";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Shield, UserCircle } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import Link from "next/link";
import { CourseCountContext } from "@/app/_context/CourseCountContext";
import { FREE_COURSE_LIMIT } from "@/lib/constants";

function SideBar({ onNavigate }) {
  const MenuList = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Upgrade",
      icon: Shield,
      path: "/dashboard/upgrade",
    },
    {
      name: "Profile",
      icon: UserCircle,
      path: "/dashboard/profile",
    },
  ];

  const { totalCourse, isMember } = useContext(CourseCountContext);
  const path = usePathname();
  const limitReached = !isMember && totalCourse >= FREE_COURSE_LIMIT;

  return (
    <div className="h-screen shadow-md p-5 relative">
      <Link href="/dashboard" onClick={onNavigate} className="flex gap-2 items-center">
        <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
        <h2 className="font-bold text-2xl">Learnify</h2>
      </Link>

      <div className="mt-10">
        {limitReached ? (
          <Button className="w-full cursor-not-allowed opacity-50" disabled>
            + Create New
          </Button>
        ) : (
          <Link href={"/create"} className="w-full" onClick={onNavigate}>
            <Button className="w-full cursor-pointer">+ Create New</Button>
          </Link>
        )}
      </div>

      <div className="mt-5">
        {MenuList.map((menu, index) => (
          <Link
            key={index}
            href={menu.path}
            onClick={onNavigate}
            className={`flex gap-5 items-center p-3 hover:bg-slate-200 rounded-lg cursor-pointer mt-3
              ${path === menu.path ? "bg-slate-200" : ""}`}
          >
            <menu.icon />
            <h2>{menu.name}</h2>
          </Link>
        ))}
      </div>

      <div className="border p-5 bg-slate-100 rounded-lg absolute bottom-10 w-[85%]">
        {isMember ? (
          <div>
            <h2 className="text-lg">Unlimited Credits</h2>
            <p className="text-sm text-gray-500 mt-1">
              {totalCourse} course{totalCourse === 1 ? "" : "s"} created
            </p>
            <Link
              href={"/dashboard/upgrade"}
              onClick={onNavigate}
              className="text-primary text-xs mt-3 inline-block"
            >
              Manage your plan
            </Link>
          </div>
        ) : limitReached ? (
          <div>
            <h2 className="text-lg text-red-600">Credit Limit Reached</h2>
            <Link
              href={"/dashboard/upgrade"}
              onClick={onNavigate}
              className="text-primary text-xs mt-3 inline-block"
            >
              Upgrade your plan to create more courses
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-lg">
              Available Credits : {FREE_COURSE_LIMIT - totalCourse}
            </h2>
            <Progress value={(totalCourse / FREE_COURSE_LIMIT) * 100} />
            <h2 className="mt-2">
              {totalCourse} out of {FREE_COURSE_LIMIT} Credits used
            </h2>
            <Link
              href={"/dashboard/upgrade"}
              onClick={onNavigate}
              className="text-primary text-xs mt-3 inline-block"
            >
              Upgrade to create more
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default SideBar;
