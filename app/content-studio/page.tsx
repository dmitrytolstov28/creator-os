"use client";

import AppShell from "@/components/layout/AppShell";
import ContentStudio from "@/components/content-studio/ContentStudio";

export default function ContentStudioPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Content Studio
          </h1>

          <p className="mt-2 text-zinc-400">
            Generate your next Reel from idea to script.
          </p>
        </div>

        <ContentStudio />
      </div>
    </AppShell>
  );
}