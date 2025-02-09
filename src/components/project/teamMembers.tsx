"use client";

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function TeamMembersList() {
  const { projectId } = useProject();
  const { data: members } = api.project.getTeamMembers.useQuery({
    projectId,
  });

  const membersToShow = members?.length > 3 ? 3 : members?.length;

  const remainingMembers = members?.length - membersToShow;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {members?.slice(0, membersToShow)?.map((member, index) => (
                <Avatar
                  key={member.id}
                  className="h-8 w-8 border-2 border-background ring-0"
                  style={{
                    zIndex: members?.length - index,
                  }}
                >
                  <AvatarImage
                    src={member?.user?.imageUrl}
                    alt={member?.user?.firstName}
                  />
                  <AvatarFallback>
                    {member?.user?.firstName?.slice(0, 2)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {remainingMembers > 0 && (
              <span className="-ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                +{remainingMembers}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Team Members</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
