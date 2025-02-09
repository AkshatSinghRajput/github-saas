"use client";

import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import useProject from "@/hooks/use-project";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import React from "react";
import { askQuestion } from "./actions/dashboard.actions";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "./CodeReferences";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";

type FileReferenceType = {
  fileName: string;
  sourceCode: string;
  summary: string;
};

export default function AskQuestion() {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileReferences, setFileReferences] = useState<FileReferenceType[]>([]);
  const [answer, setAnswer] = useState("");
  const refetch = useRefetch();

  const saveAnswer = api.project.saveAnswer.useMutation();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (!project!.id) return;
    setLoading(true);
    setOpen(true);

    const { output, fileReferences } = await askQuestion(question, project!.id);

    setFileReferences(fileReferences);

    for await (const text of readStreamableValue(output)) {
      if (text) {
        setAnswer((ans) => ans + text);
      }
    }
    setLoading(false);
  }

  async function saveQuestion() {
    setLoading(true);
    saveAnswer.mutate(
      {
        projectId: project!.id,
        question,
        answer,
        filesReferences: fileReferences,
      },
      {
        onSuccess: () => {
          toast.success("Question saved successfully!");
        },
        onError: () => {
          toast.error("Error Saving Question!");
        },
        onSettled: () => {
          setLoading(false);
        },
      },
    );
    await refetch();
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            setAnswer("");
          }
          setOpen(open);
        }}
      >
        <DialogContent className="flex flex-col items-center gap-4 sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Ask a Question</span>

              <Button
                variant="outline"
                onClick={() => {
                  saveQuestion();
                }}
                disabled={loading}
              >
                Save question
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div data-color-mode="light">
            <MDEditor.Markdown
              source={answer}
              className="!h-full max-h-[36vh] max-w-[70vw] overflow-auto"
            />
          </div>

          <CodeReferences fileReferences={fileReferences}></CodeReferences>
          <div className="w-full">
            <Button className="w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Card className="w-full">
        <form
          className="flex h-[24dvh] w-full flex-col gap-2 p-4"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-bold">Ask a Question</h1>
            <p className="text-sm text-gray-500">
              AI has knowledge of your codebase
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Textarea
              placeholder="What do you want to ask?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="flex w-full items-center gap-4">
            <Button variant="default" type="submit" disabled={loading}>
              Ask
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
