"use client";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import React from "react";
import { Card } from "../ui/card";
import { Commit } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

function CommitCard({ commits }: { commits: Commit }) {
  const { project, projectId } = useProject();
  return (
    <Card className="flex w-full flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <h2 className="font-bold text-black">{commits?.commitAuthorName}</h2>
        <span>committed</span>
        <Link
          href={`${project?.githubUrl}/commit/${commits.commitHash}`}
          target="_blank"
        >
          <ExternalLink size={12}></ExternalLink>
        </Link>
      </div>
      <h1 className="text-lg font-bold">
        {commits?.commitMessage.length > 50
          ? commits?.commitMessage.substring(0, 50) + "..."
          : commits?.commitMessage}
      </h1>
      <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
        {commits?.summary}
      </pre>
    </Card>
  );
}

export default function CommitLog() {
  const { projectId } = useProject();

  const { data: commits } = api.project.getCommits.useQuery({ projectId });

  return commits ? (
    <Card className="flex h-[52dvh] flex-col gap-3 overflow-y-auto p-3">
      <ul className="space-y-6">
        {commits.map((commit, commitIdx) => (
          <li key={commit.id} className="relative flex gap-x-4">
            <div
              className={cn(
                commitIdx === commits.length - 1 ? "h-6" : "-bottom-6",
                "absolute left-0 top-0 flex w-6 justify-center",
              )}
            >
              <div className="w-px translate-x-1 bg-gray-200"></div>
            </div>
            <>
              <img
                src={commit?.commitAuthorAvatar}
                alt="avatar"
                width={100}
                height={100}
                className="relative mt-4 size-8 flex-none rounded-full bg-gray-50"
              />
              <CommitCard key={commit.id} commits={commit as any} />
            </>
          </li>
        ))}
      </ul>
    </Card>
  ) : (
    <Card className="h-52 overflow-y-auto">
      <div className="flex h-full items-center justify-center">
        <div className="text-lg font-bold">No commits found</div>
      </div>
    </Card>
  );
}
