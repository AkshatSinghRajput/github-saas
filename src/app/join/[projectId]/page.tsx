import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function JoinProject(props: Props) {
  const { projectId } = await props.params;
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const dbUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!dbUser) {
    await db.user.create({
      data: {
        id: userId,
        emailAddress: user?.emailAddresses[0]!.emailAddress,
        imageUrl: user?.imageUrl,
        firstName: user?.firstName,
        lastName: user?.lastName,
      },
    });
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  try {
    await db.userToProject.create({
      data: {
        userId,
        projectId,
      },
    });
  } catch (e) {
    console.log("User already in project");
  }

  if (project) redirect("/dashboard");
  return <>Join Project</>;
}
