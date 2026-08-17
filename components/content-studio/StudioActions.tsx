"use client";

import {
  CalendarPlus,
  ClipboardCopy,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type StudioActionsProps = {
  onSchedule: () => void;
  onCopyAll: () => void;
};

export default function StudioActions({
  onSchedule,
  onCopyAll,
}: StudioActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        onClick={onSchedule}
        className="border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
      >
        <CalendarPlus size={17} />
        Schedule
      </Button>

      <Button
        type="button"
        onClick={onCopyAll}
        className="border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
      >
        <ClipboardCopy size={17} />
        Copy All
      </Button>
    </div>
  );
}