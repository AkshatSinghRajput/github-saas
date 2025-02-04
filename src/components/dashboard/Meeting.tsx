"use client";

import { PresentationIcon, UploadIcon } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function UploadMeeting() {
  return (
    <Card className="flex h-[24dvh] w-full flex-col items-center gap-2 p-4">
      <PresentationIcon size={30} />
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-lg font-bold">Create a new Meeting</h1>
        <p className="text-sm text-gray-500">Analyze your meeting.</p>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="default"
          onClick={() => {
            alert("Meeting uploaded!");
          }}
        >
          <UploadIcon />
          <span>Upload Meeting</span>
        </Button>
      </div>
    </Card>
  );
}
