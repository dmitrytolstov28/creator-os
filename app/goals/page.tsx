"use client";

import AppShell from "@/components/layout/AppShell";
import GoalCard from "@/components/goals/GoalCard";
import { Card } from "@/components/ui/card";
import { Flame, Trophy, TrendingUp } from "lucide-react";

export default function GoalsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Goals
          </h1>

          <p className="mt-2 text-zinc-400">
            Track your creator progress and stay consistent.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <GoalCard
            title="Monthly Posts"
            current={12}
            target={20}
          />

          <GoalCard
            title="Weekly Posts"
            current={3}
            target={5}
          />

          <GoalCard
            title="Videos This Year"
            current={84}
            target={150}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
            <div className="flex items-center gap-3">
              <Flame className="text-orange-400" />
              <h2 className="text-xl font-semibold">
                Upload Streak
              </h2>
            </div>

            <p className="mt-6 text-5xl font-bold">
              14
            </p>

            <p className="mt-2 text-zinc-400">
              Days in a row
            </p>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-400" />
              <h2 className="text-xl font-semibold">
                Completion Rate
              </h2>
            </div>

            <p className="mt-6 text-5xl font-bold">
              87%
            </p>

            <p className="mt-2 text-zinc-400">
              Last 30 days
            </p>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-400" />
              <h2 className="text-xl font-semibold">
                Next Milestone
              </h2>
            </div>

            <p className="mt-6 text-2xl font-bold">
              100 Videos
            </p>

            <p className="mt-2 text-zinc-400">
              16 videos remaining
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}