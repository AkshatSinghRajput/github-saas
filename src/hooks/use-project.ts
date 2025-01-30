"use client";

import { api } from "@/trpc/react";
import React from "react";

export default function useProject() {
  const { data: projects } = api.project.getProjects.useQuery();

  return {
    projects,
  };
}
