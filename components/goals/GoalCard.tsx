"use client";

import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

type GoalCardProps = {
  title: string;
  current: number;
  target: number;
};

export default function GoalCard({
  title,
  current,
  target,
}: GoalCardProps) {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>

        <Target size={20} className="text-violet-400" />
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="text-3xl font-bold">{current}</span>
        <span className="pb-1 text-zinc-500">/ {target}</span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-violet-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-zinc-400">
        {Math.round(progress)}% Complete
      </p>
    </Card>
  );
}