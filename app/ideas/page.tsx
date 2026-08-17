"use client";

import AppShell from "@/components/layout/AppShell";
import IdeaGenerator from "@/components/ideas/IdeaGenerator";

export default function IdeasPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Content Ideas
          </h1>

          <p className="mt-2 text-zinc-400">
            Generate content ideas using your own performance data.
          </p>
        </div>

        <IdeaGenerator />
      </div>
    </AppShell>
  );
}