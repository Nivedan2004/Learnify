"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardHeader from "../dashboard/_components/DashboardHeader";

function PaymentSuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState("confirming");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    axios
      .post("/api/payment/verify", { sessionId })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [sessionId]);

  return (
    <div className="max-w-xl mx-auto mt-20 border rounded-2xl p-10 text-center shadow-sm">
      <h1 className="text-3xl font-bold">
        {status === "success" ? "You're on Monthly!" : status === "error" ? "Payment pending" : "Confirming payment..."}
      </h1>
      <p className="text-gray-500 mt-3">
        {status === "success"
          ? "Your plan is active. You can now generate unlimited courses."
          : status === "error"
          ? "If you were charged, your plan will activate in a moment. Try refreshing the dashboard."
          : "Please wait while we confirm your subscription."}
      </p>
      <Link href="/dashboard">
        <Button className="mt-8">Go to Dashboard</Button>
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div>
      <DashboardHeader />
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
