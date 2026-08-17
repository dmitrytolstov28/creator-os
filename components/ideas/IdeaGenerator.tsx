"use client";

import { useState } from "react";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function IdeaGenerator() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateIdea() {
    setLoading(true);

    try {
      const { data: videos } = await supabase
        .from("videos")
        .select("*")
        .limit(50);

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question:
            "Generate ONE viral video idea based on my highest performing content. Explain why it should work and include a hook, title, and CTA.",
          videos,
          messages: [],
        }),
      });

      const result = await response.json();

      setIdea(result.answer);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Lightbulb className="text-yellow-400" />
            AI Idea Generator
          </h2>

          <p className="mt-2 text-zinc-400">
            Generate a new content idea from your own analytics.
          </p>
        </div>

        <Button
          onClick={generateIdea}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-500"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Thinking...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate
            </>
          )}
        </Button>
      </div>

      {idea && (
        <div className="mt-6 rounded-xl border border-zinc-800 bg-black/30 p-5">
          <div className="whitespace-pre-wrap leading-7 text-zinc-300">
            {idea}
          </div>
        </div>
      )}
    </Card>
  );
}