"use client";

import AppShell from "@/components/layout/AppShell";
import AIChat from "@/components/ai-coach/AIChat";
import AIReport from "@/components/ai-coach/AIReport";

export default function AICoachPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            AI Coach
          </h1>

          <p className="mt-2 text-zinc-400">
            Generate reports and chat with your video data.
          </p>
        </div>

        <AIReport />
        <AIChat />
      </div>
    </AppShell>
  );
}