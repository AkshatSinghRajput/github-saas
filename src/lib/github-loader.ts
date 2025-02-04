import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summarizeCode } from "./gemini";
import { db } from "@/server/db";

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
    unknown: "warn",
    maxConcurrency: 5,
  });
  const repo = await loader.load();
  return repo;
};

export const indexGithubRepo = async (
  projectId: string,
  githubURL: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubURL, githubToken);
  if (!docs) {
    console.log("No documents found in the repository");
    return;
  }
  const allEmbeddings = await generateEmbeddings(docs);
  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      if (!embedding) return;
      const sourceCodeEmbedding = await db.sourceCodeEmbeddings.create({
        data: {
          summary: embedding.summary,
          sourceCode: embedding.sourceCode,
          fileName: embedding.fileName,
          projectId,
        },
      });

      await db.$executeRaw`
      UPDATE "SourceCodeEmbedding" 
      SET embedding = ${embedding.embedding}
      WHERE id = ${sourceCodeEmbedding.id}
      `;
    }),
  );
};

export const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      const summary = await summarizeCode(doc);
      const embedding = await generateEmbedding(summary);
      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.fileName,
      };
    }),
  );
};
