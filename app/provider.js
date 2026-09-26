"use client";
import { Toaster } from "sonner";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    axios.post("/api/create-user").catch(() => {});
  }, [user]);

  return (
    <div>
      {children}
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default Provider;
