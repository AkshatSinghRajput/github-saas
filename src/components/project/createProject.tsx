"use client";

import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";

type formInput = {
  repoUrl: string;
  projectName: string;
  githubToken: string;
};

export default function CreateProjectForm() {
  const { register, handleSubmit, reset } = useForm<formInput>();

  // Add Zod validation here
  const CreateProject = api.project.createProject.useMutation();

  const refetch = useRefetch();

  function onSubmit(data: formInput) {
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
  }

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
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={CreateProject.isPending}
        >
          Create Project
        </Button>
      </form>
    </div>
  );
}
