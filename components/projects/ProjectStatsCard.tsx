"use client";

import { Card } from "@/components/ui/card";

type Props = {
  title: string;
  value: number;
};

export default function ProjectStatsCard({
  title,
  value,
}: Props) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-white">
        {value}
      </h2>
    </Card>
  );
}