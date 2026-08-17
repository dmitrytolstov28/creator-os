"use client";

import { FolderOpen, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";

type ProjectCardProps = {
  name: string;
  drafts: number;
  color: string;
};

export default function ProjectCard({
  name,
  drafts,
  color,
}: ProjectCardProps) {
  return (
    <Card className="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
        >
          <FolderOpen className="text-white" size={24} />
        </div>

        <button className="opacity-0 transition-opacity group-hover:opacity-100">
          <MoreVertical
            size={18}
            className="text-zinc-500 hover:text-white"
          />
        </button>
      </div>

      <h2 className="mt-5 text-xl font-semibold text-white">
        {name}
      </h2>

      <p className="mt-2 text-sm text-zinc-400">
        {drafts} {drafts === 1 ? "Draft" : "Drafts"}
      </p>
    </Card>
  );
}