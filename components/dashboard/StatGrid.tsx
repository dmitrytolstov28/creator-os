"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle,
  FileText,
  FolderKanban,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { getDashboardStats } from "../../lib/dashboard";

export default function StatGrid() {
  const [stats, setStats] = useState({
    drafts: 0,
    scheduled: 0,
    posted: 0,
    projects: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    }

    void loadStats();
  }, []);

  const cards = [
    {
      title: "Drafts",
      value: stats.drafts,
      icon: FileText,
    },
    {
      title: "Scheduled",
      value: stats.scheduled,
      icon: Calendar,
    },
    {
      title: "Posted",
      value: stats.posted,
      icon: CheckCircle,
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderKanban,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="border-zinc-800 bg-zinc-900 p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                {card.title}
              </p>

              <Icon
                size={20}
                className="text-violet-400"
              />
            </div>

            <h2 className="mt-4 text-4xl font-bold text-white">
              {card.value}
            </h2>
          </Card>
        );
      })}
    </div>
  );
}