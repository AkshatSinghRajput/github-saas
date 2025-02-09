"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();

  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;
  const result = (await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) as similarity
    FROM "SourceCodeEmbeddings"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.3
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10
    `) as {
    fileName: string;
    sourceCode: string;
    summary: string;
  }[];

  let context = "";

  for (const doc of result) {
    context += `source ${doc.fileName}\ncode content: ${doc.sourceCode}\nsummary: ${doc.summary}\n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-2.0-flash-exp"),
      prompt: `You are a technical AI assistant analyzing codebases. Respond to questions based solely on the provided context.

CONTEXT:
${context}

QUESTION:
${question}

Guidelines:
- Use markdown format with code snippets where relevant
- Only use information from the provided context
- If context doesn't contain the answer, respond with "I don't have enough information to answer that question"
- Provide clear, step-by-step explanations for code-related queries
- Structure your response logically using headings and bullet points
- Be concise and factual`,
    });

    for await (const text of textStream) {
      stream.update(text);
    }
    stream.done();
  })();

  return {
    output: stream.value,
    fileReferences: result,
  };
}
