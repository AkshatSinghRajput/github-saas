"use client";

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import AskQuestion from "../dashboard/question";
import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/CodeReferences";

export default function QAPageComponent() {
  const { projectId } = useProject();
  const { data: questions } = api.project.getQuestions.useQuery({
    projectId: projectId,
  });

  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions && questions[questionIndex];

  return (
    <Sheet>
      <AskQuestion></AskQuestion>
      <h1 className="mb-2 mt-4 text-xl font-semibold">Saved Questions</h1>
      <div className="flex flex-col gap-2 px-4">
        {questions &&
          questions.map((question: any, index) => {
            return (
              <React.Fragment key={question?.id}>
                <SheetTrigger
                  onClick={() => {
                    setQuestionIndex(index);
                  }}
                >
                  <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow">
                    <img
                      src={question?.user?.imageUrl ?? ""}
                      alt=""
                      className="rounded-full"
                      height={30}
                      width={30}
                    />
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <p className="line-clamp-1 text-lg font-medium text-gray-700">
                          {question?.question}
                        </p>
                        <span className="whitespace-nowrap text-xs text-gray-500">
                          {question?.createdAt?.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-sm text-gray-500">
                        {question?.answer}
                      </p>
                    </div>
                  </div>
                </SheetTrigger>
              </React.Fragment>
            );
          })}
      </div>
      {question && (
        <SheetContent className="sm:max-w-[80vw]">
          <SheetHeader>
            <SheetTitle className="text-lg">{question?.question}</SheetTitle>
            <div className="" data-color-mode="light">
              <MDEditor.Markdown
                source={question?.answer ?? "No answer provided yet."}
                className="!h-full max-h-[36vh] max-w-[70vw] overflow-auto"
              />
            </div>
            <div className="h-3"></div>
            <CodeReferences
              fileReferences={question?.fileReferences || ([] as any)}
            />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
}
