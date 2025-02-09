"use client";

import React, { useState } from "react";
import { Tabs, TabsContent } from "../ui/tabs";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { lucario } from "react-syntax-highlighter/dist/esm/styles/prism";

type props = {
  fileReferences: {
    fileName: string;
    sourceCode: string;
    summary: string;
  }[];
};

export default function CodeReferences({ fileReferences }: props) {
  const [tab, setTab] = useState(fileReferences[0]?.fileName);
  if (fileReferences.length === 0) return null;
  return (
    <div className="max-w-[70vw]">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="mb-3 flex gap-2 overflow-scroll rounded-md bg-gray-200 p-1">
          {fileReferences.map((file) => (
            <button
              key={file.fileName}
              value={file.fileName}
              onClick={() => setTab(file.fileName)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
                {
                  "bg-primary text-primary-foreground": tab === file.fileName,
                },
              )}
            >
              {file?.fileName.split("/")[file?.fileName.split("/").length - 1]}
            </button>
          ))}
        </div>
        {fileReferences.map((file) => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="max-h-[40vh] max-w-7xl overflow-scroll rounded-md"
          >
            <SyntaxHighlighter language="javascript" style={lucario}>
              {file.sourceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
