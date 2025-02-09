"use client";

import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { toast } from "sonner";

export default function DeleteProjectButton() {
  const { projectId } = useProject();
  const archiveProject = api.project.archiveProject.useMutation();
  const refetch = useRefetch();

  async function deleteProject() {
    archiveProject.mutate(
      {
        projectId: projectId,
      },
      {
        onSuccess: () => {
          toast.success("Project archived successfully");
        },
        onError: () => {
          toast.error("Error Archiving Project");
        },
        onSettled: () => {
          refetch();
        },
      },
    );
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full sm:w-auto">
            Archive
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure to Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will Archive the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteProject}
              disabled={archiveProject.isPending}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
