"use client";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";

export default function AskQuestion() {
  return (
    <Card className="flex h-[24dvh] w-full flex-col gap-2 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">Ask a Question</h1>
        <p className="text-sm text-gray-500">
          AI has knowledge of your codebase
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Textarea placeholder="What do you want to ask?" />
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="default"
          onClick={() => {
            alert("Question asked!");
          }}
        >
          Ask
        </Button>
      </div>
    </Card>
  );
}
