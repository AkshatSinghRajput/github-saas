"use client";

import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";
import { Info } from "lucide-react";

type formInput = {
  repoUrl: string;
  projectName: string;
  githubToken: string;
};

export default function CreateProjectForm() {
  const { register, handleSubmit, reset } = useForm<formInput>();

  // Add Zod validation here
  const CreateProject = api.project.createProject.useMutation();

  const checkCredits = api.project.checkCredits.useMutation();

  const refetch = useRefetch();

  function onSubmit(data: formInput) {
    if (!!checkCredits.data) {
      CreateProject.mutate(
        {
          githubUrl: data.repoUrl,
          name: data.projectName,
          githubToken: data.githubToken,
        },
        {
          onSuccess: () => {
            toast.success("Project created successfully");
            refetch();
            reset();
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    } else {
      checkCredits.mutate({
        githubToken: data?.githubToken,
        githubUrl: data?.repoUrl,
      });
    }
  }

  const hasEnoughCredits = checkCredits?.data?.userCredits
    ? checkCredits?.data?.fileCount <= checkCredits?.data?.userCredits
    : true;

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl bg-white/10 p-4">
      <h1 className="text-2xl font-bold">Link your Github Project</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4"
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="repoUrl">Repository URL</Label>
            <Input
              id="repoUrl"
              type="text"
              placeholder="https://github.com/username/repo"
              {...register("repoUrl")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              type="text"
              placeholder="My Project"
              {...register("projectName")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="githubToken">Github Token</Label>
            <Input
              id="githubToken"
              type="password"
              placeholder="ghp_xxxxxxxxxxxx"
              {...register("githubToken")}
            />
            {!!checkCredits.data && (
              <>
                <div className="mt-4 rounded-md border border-orange-200 bg-orange-50 px-4 py-2 text-orange-700">
                  <div className="flex items-center gap-2">
                    <Info className="size-4"></Info>
                    {/* <p className="text-sm">
                      You will be charged{" "}
                      <strong>{checkCredits.data?.fileCount + ` `}</strong>
                      credits for this repository.
                    </p> */}
                    {hasEnoughCredits ? (
                      <p className="text-sm">
                        You will be charged{" "}
                        <strong>{checkCredits.data?.fileCount + ` `}</strong>
                        credits for this repository.
                      </p>
                    ) : (
                      <p className="text-sm">
                        You don't have enough credits to process this
                        repository.
                      </p>
                    )}
                  </div>
                  <p className="ml-6 text-sm text-blue-800">
                    You have{" "}
                    <strong>{checkCredits.data?.userCredits + ` `}</strong>
                    credits remaining.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={CreateProject.isPending || checkCredits.isPending}
        >
          {!checkCredits.data ? "Check Credits" : "Create Project"}
        </Button>
      </form>
    </div>
  );
}
