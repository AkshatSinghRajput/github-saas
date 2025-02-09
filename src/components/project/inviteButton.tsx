"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import useProject from "@/hooks/use-project";
import { Button } from "../ui/button";
import { ClipboardCopyIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function InviteButton() {
  const [open, setOpen] = useState(false);
  const { projectId } = useProject();
  const [isCopied, setIsCopied] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-400">Ask them to paste this link</p>
          <div className="flex items-baseline gap-2">
            <Input
              readOnly
              className="w-full"
              value={`${typeof window !== undefined && window && window?.location?.origin}/join/${projectId}`}
            />
            <Button
              className={cn({
                "bg-green-400": isCopied,
              })}
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${typeof window !== undefined && window && window?.location?.origin}/join/${projectId}`,
                );
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
                toast.success("Copied Successfully!");
              }}
            >
              <ClipboardCopyIcon size={24}></ClipboardCopyIcon>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        className="w-full sm:w-auto"
        type="button"
        variant="outline"
        onClick={() => {
          setOpen(true);
        }}
      >
        Invite Members
      </Button>
    </>
  );
}
