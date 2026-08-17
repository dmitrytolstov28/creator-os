"use client";

import { useEffect, useState } from "react";
import { Brain, Sparkles, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

type Insight = {
  title: string;
  description: string;
};

export default function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    async function loadInsights() {
      const { data } = await supabase
        .from("videos")
        .select("views, likes, comments, shares, saves, content_type")
        .order("views", { ascending: false });

      if (!data || data.length === 0) {
        setInsights([
          {
            title: "No data yet",
            description: "Add videos to start receiving AI insights.",
          },
        ]);
        return;
      }

      const bestVideo = data[0];

      const engagement =
        bestVideo.views > 0
          ? (
              ((bestVideo.likes +
                bestVideo.comments +
                bestVideo.shares +
                bestVideo.saves) /
                bestVideo.views) *
              100
            ).toFixed(1)
          : "0.0";

      setInsights([
        {
          title: "Top Performing Video",
          description: `Your best video has ${bestVideo.views.toLocaleString()} views with ${engagement}% engagement.`,
        },
        {
          title: "Content Recommendation",
          description: bestVideo.content_type
            ? `Your best performing content type is "${bestVideo.content_type}". Consider creating more of it.`
            : "Add a content type to your videos for smarter recommendations.",
        },
      ]);
    }

    loadInsights();
  }, []);

  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-500/15 p-3">
          <Brain className="text-violet-400" size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold">AI Insights</h2>

          <p className="text-sm text-zinc-400">
            Generated from your videos
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {insights.map((insight, index) => (
          <Insight
            key={index}
            icon={
              index === 0 ? (
                <TrendingUp size={17} />
              ) : (
                <Sparkles size={17} />
              )
            }
            title={insight.title}
            description={insight.description}
          />
        ))}
      </div>
    </Card>
  );
}

function Insight({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-violet-400">{icon}</div>

        <div>
          <h3 className="font-medium text-white">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-zinc-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}