"use client";
import React, { useState } from "react";
import { CourseCountContext } from "../_context/CourseCountContext";
import DashboardHeader from "./_components/DashboardHeader";
import SideBar from "./_components/SideBar";

function DashboardLayout({ children }) {
  const [totalCourse, setTotalCourse] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <CourseCountContext.Provider
      value={{ totalCourse, setTotalCourse, isMember, setIsMember }}
    >
      <div>
        <div className="md:w-64 hidden md:block fixed">
          <SideBar />
        </div>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-64 bg-white h-full">
              <SideBar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}
        <div className="md:ml-64">
          <DashboardHeader onMenuClick={() => setMobileOpen(true)} />
          <div className="p-10">{children}</div>
        </div>
      </div>
    </CourseCountContext.Provider>
  );
}

export default DashboardLayout;
