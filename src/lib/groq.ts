import Groq from "groq-sdk";
import { Document } from "@langchain/core/documents";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function summarizeCode(doc: Document) {
  const code = doc.pageContent.slice(0, 10000); // Limit to 10k characters

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an expert senior developer who specializes in summarizing code.",
      },
      {
        role: "user",
        content: `Summarize the code in less than 100 words but with highest accuracy:
        ----
        ${code}
        ----`,
      },
    ],
    model: "gemma2-9b-it",
    temperature: 0.0,
  });
  return response.choices[0].message.content; // Return the response as a string
}
