"use client";

import useProject from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { GithubIcon, LinkIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import AskQuestion from "./question";
import UploadMeeting from "./Meeting";
import CommitLog from "./CommitLog";
import DeleteProjectButton from "../project/deleteProject";
// import InviteButton from "../project/inviteButton";

import TeamMembersList from "../project/teamMembers";
import dynamic from "next/dynamic";

const InviteButton = dynamic(() => import("../project/inviteButton"), {
  ssr: false,
});

export default function Dashboard() {
  // this is a custom hook that fetches the user data
  const user = useUser();

  // this is a custom hook that fetches the project data
  const { projectId, project } = useProject();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
        {/* Button Icon Here for Github */}
        <Button variant="default" asChild className="w-full sm:w-auto">
          <Link href={project?.githubUrl || "#"} target="_blank">
            <div className="flex items-center gap-2">
              <GithubIcon />
              <span className="text-sm sm:text-base">
                This Project is linked to:
                {project?.githubUrl?.length < 20
                  ? project?.githubUrl
                  : project?.githubUrl.slice(0, 20) + " ..."}
              </span>
              <LinkIcon />
            </div>
          </Link>
        </Button>

        {/* Button Icons here for Invite Team Member and Archive */}
        <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:gap-4">
          {/* <Button variant="outline" asChild className="w-full sm:w-auto">
            <div className="flex items-center gap-2">Invite Team Member</div>
          </Button> */}
          <TeamMembersList></TeamMembersList>
          <InviteButton></InviteButton>
          <DeleteProjectButton></DeleteProjectButton>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <AskQuestion></AskQuestion>
        {/* <UploadMeeting></UploadMeeting> */}
      </div>
      <CommitLog></CommitLog>
    </div>
  );
}
