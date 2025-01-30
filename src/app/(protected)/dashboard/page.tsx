import Dashboard from "@/components/dashboard/dashboard";
import { useUser } from "@clerk/nextjs";
import React from "react";

export default async function DashboardPage() {
  return <Dashboard></Dashboard>;
}
