"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function DashboardHeader({ onMenuClick }) {
  const path = usePathname();
  return (
    <div
      className={`p-5 shadow-md flex ${
        path == "/dashboard" ? "justify-between md:justify-end" : "justify-between"
      }`}
    >
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu />
          </Button>
        )}
        {path != "/dashboard" && (
          <Link href={"/dashboard"}>
            <div className="flex gap-2 items-center">
              <Image src={"/logo.svg"} alt="logo" width={30} height={30} />
              <h2 className="font-bold text-xl">Learnify</h2>
            </div>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        <UserButton />
        <Link href={"/dashboard"}>
          <Button>Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

export default DashboardHeader;
