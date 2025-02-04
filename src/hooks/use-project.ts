"use client";

import { api } from "@/trpc/react";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

export default function useProject() {
  const { data: projects } = api.project.getProjects.useQuery();

  const [projectId, setProjectId] = useLocalStorage("projectId", "");

  const project = projects?.find((project) => project.id === projectId);

  return {
    projects,
    projectId,
    setProjectId,
    project,
  };
}
