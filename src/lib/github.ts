import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { summarizeCommits } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: String;
  commitMessage: String;
  commitDate: String;
  commitAuthorName: String;
  commitAuthorAvatar: String;
};

export const getCommitHashes = async (
  githubURL: string,
): Promise<Response[]> => {
  const { data } = await octokit.rest.repos.listCommits({
    owner: githubURL.split("/")[3],
    repo: githubURL.split("/")[4],
  });

  const sortedCommits = data.sort(
    (a, b) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime(),
  ) as any[];

  return sortedCommits.slice(0, 15).map((commit) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message || "",
    commitDate: commit.commit?.author?.date || "",
    commitAuthorName: commit.commit?.author?.name || "",
    commitAuthorAvatar: commit.author?.avatar_url || "",
  }));
};

export const pollCommits = async (projectId: string) => {
  const { githubURL, project } = await fetchProjectGithubURL(projectId);
  const commitHashes = await getCommitHashes(githubURL);
  const unProcessedCommits = await getUnprocessedCommits(
    projectId,
    commitHashes,
  );

  const summaryResponses = await Promise.allSettled(
    unProcessedCommits.map((commit) => {
      return summarizeCommit(githubURL, commit.commitHash as string);
    }),
  );

  const summaries = summaryResponses
    .filter((summary) => summary.status === "fulfilled")
    .map((summary) => summary.value as string);

  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => ({
      projectId,
      commitHash: unProcessedCommits[index]!.commitHash,
      commitMessage: unProcessedCommits[index]!.commitMessage,
      commitAuthorName: unProcessedCommits[index]!.commitAuthorName,
      commitAuthorAvatar: unProcessedCommits[index]!.commitAuthorAvatar,
      commitDate: unProcessedCommits[index]!.commitDate,
      summary,
    })) as any[],
  });

  return unProcessedCommits;
};

const getUnprocessedCommits = async (
  projectId: string,
  commitHashes: Response[],
) => {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });

  const unProcessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );
  return unProcessedCommits;
};

async function fetchProjectGithubURL(projectId: string) {
  const response = await db.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      githubUrl: true,
    },
  });

  if (!response?.githubUrl) {
    throw new Error("Project not found");
  }

  return {
    project: response,
    githubURL: response?.githubUrl,
  };
}

async function summarizeCommit(githubURL: string, commitHash: string) {
  const { data } = await axios.get(`${githubURL}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });

  if (!data) {
    return "";
  }

  return (await summarizeCommits(data)) || "";
}
