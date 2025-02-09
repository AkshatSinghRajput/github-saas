import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding } from "./gemini";
import { db } from "@/server/db";
import { summarizeCode } from "./groq";
import { Octokit } from "octokit";

export const loadGithubRepo = async (
  githubURL: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubURL, {
    accessToken: githubToken || "",
    branch: "main",
    ignoreFiles: [
      "*.md",
      "*.txt",
      "package.json",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  const docs = [];
  for await (const doc of loader.loadAsStream()) {
    docs.push(doc);
  }
  // const repo = await loader.load();
  // return repo;
  return docs;
};

const getFileCount = async (
  path: string,
  octokit: Octokit,
  githubOwner: string,
  githubRepo: string,
  acc: number = 0,
) => {
  const { data } = await octokit.rest.repos.getContent({
    owner: githubOwner,
    repo: githubRepo,
    path,
  });

  if (!Array.isArray(data) && data.type === "file") {
    return acc + 1;
  }

  if (Array.isArray(data)) {
    let fileCount = 0;

    const directories: string[] = [];

    for (const item of data) {
      if (item.type === "dir") {
        directories.push(item.path);
      } else {
        fileCount++;
      }
    }

    if (directories.length > 0) {
      const directoryCounts = await Promise.all(
        directories.map((directory) =>
          getFileCount(directory, octokit, githubOwner, githubRepo, 0),
        ),
      );
      fileCount += directoryCounts.reduce((acc, count) => acc + count, 0);
    }

    return acc + fileCount;
  }
  return acc;
};

export const checkCredits = async (githubUrl: string, githubToken?: string) => {
  const octokit = new Octokit({
    auth: githubToken,
  });

  const githubOwner = githubUrl.split("/")[3];
  const githubRepo = githubUrl.split("/")[4];

  if (!githubOwner || !githubRepo) {
    return 0;
  }

  const fileCount = await getFileCount("", octokit, githubOwner, githubRepo, 0);
  return fileCount;
};

export const indexGithubRepo = async (
  projectId: string,
  githubURL: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubURL, githubToken);
  console.log(`Loaded ${docs.length} documents from the repository`);

  if (!docs) {
    console.log("No documents found in the repository");
    return;
  }
  const allEmbeddings = await generateEmbeddings(docs);
  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      if (!embedding) return;
      console.log(
        `Indexing document ${index + 1} of ${JSON.stringify(embedding)}`,
      );

      const sourceCodeEmbedding = await db.sourceCodeEmbeddings.create({
        data: {
          summary: embedding.summary,
          sourceCode: embedding.sourceCode,
          fileName: embedding.fileName || `file-${index}`,
          projectId,
        },
      });

      await db.$executeRaw`
      UPDATE "SourceCodeEmbeddings" 
      SET "summaryEmbedding" = ${embedding.embedding}
      WHERE id = ${sourceCodeEmbedding.id}
      `;
    }),
  );
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateEmbeddings = async (docs: Document[]) => {
  const results = [];
  const batchSize = 30; // Process 30 documents per minute to stay under rate limit

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (doc) => {
        const summary = await summarizeCode(doc);
        const embedding = await generateEmbedding(summary);
        console.log(`Generated embedding for ${JSON.stringify(doc)}`);
        return {
          summary,
          embedding,
          sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
          fileName: doc.metadata.source,
        };
      }),
    );
    results.push(...batchResults);

    if (i + batchSize < docs.length) {
      await sleep(60000); // Wait for 1 minute before processing next batch
    }
  }

  return results;
};
