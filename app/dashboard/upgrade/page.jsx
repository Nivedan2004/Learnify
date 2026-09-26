"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

function Upgrade() {
  const [userDetail, setUserDetail] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetUserDetail();
  }, []);

  const GetUserDetail = async () => {
    try {
      const result = await axios.get("/api/user");
      setUserDetail(result.data.result);
    } catch (error) {
      toast.error("Could not load your plan.");
    }
  };

  const OnCheckoutClick = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/payment/checkout", {
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
      });
      if (!result.data?.url) {
        toast.error("Checkout is unavailable right now.");
        return;
      }
      window.location.href = result.data.url;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Could not start checkout.");
    } finally {
      setLoading(false);
    }
  };

  const onPaymentMange = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/payment/manage-payment");
      if (!result.data?.url) {
        toast.error("Billing portal is unavailable right now.");
        return;
      }
      window.location.href = result.data.url;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Could not open billing portal.");
    } finally {
      setLoading(false);
    }
  };

  const isMember = Boolean(userDetail?.isMember);

  return (
    <div>
      <h2 className="font-medium text-3xl">Plans</h2>
      <p>Upgrade your plan to generate more courses</p>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                Free
                <span className="sr-only">Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {" "}
                  $0{" "}
                </strong>
                <span className="text-sm font-medium text-gray-700">/month</span>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <PlanItem text="5 Course Generate" />
              <PlanItem text="Limited Support" />
              <PlanItem text="Email support" />
              <PlanItem text="Help center access" />
            </ul>

            <Button variant="ghost" className="w-full mt-5 text-primary" disabled>
              {isMember ? "Free Plan" : "Current Plan"}
            </Button>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                Monthly
                <span className="sr-only">Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {" "}
                  $50{" "}
                </strong>
                <span className="text-sm font-medium text-gray-700">/Month</span>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <PlanItem text="Unlimited Courses" />
              <PlanItem text="Unlimited Flashcards" />
              <PlanItem text="Email support" />
              <PlanItem text="Help center access" />
            </ul>

            {!isMember ? (
              <Button onClick={OnCheckoutClick} className="w-full mt-5" disabled={loading}>
                {loading ? <Loader className="animate-spin" /> : "Upgrade"}
              </Button>
            ) : (
              <Button
                onClick={onPaymentMange}
                className="w-full mt-5 cursor-pointer"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : "Manage Payment"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanItem({ text }) {
  return (
    <li className="flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-5 text-indigo-700"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <span className="text-gray-700"> {text} </span>
    </li>
  );
}

export default Upgrade;
