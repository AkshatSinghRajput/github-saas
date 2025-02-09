// import Dashboard from "@/components/dashboard/dashboard";
import dynamic from "next/dynamic";
import React from "react";

const Dashboard = dynamic(() => import("@/components/dashboard/dashboard"));

export default async function DashboardPage() {
  return <Dashboard></Dashboard>;
}
