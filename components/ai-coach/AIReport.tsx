"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

type AIReportData = {
  summary: string;
  strengths: string[];
  improvements: string[];
  nextVideoIdea: string;
  score: number;
};

export default function AIReport() {
  const [report, setReport] = useState<AIReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateReport() {
    setLoading(true);
    setError("");

    try {
      const { data: videos, error: videosError } = await supabase
        .from("videos")
        .select(
          `
            title,
            platform,
            views,
            likes,
            comments,
            shares,
            saves,
            followers_gained,
            date_posted,
            video_length,
            hook,
            caption,
            hashtags,
            sound,
            topic,
            content_type,
            cta,
            notes
          `,
        )
        .order("created_at", { ascending: false })
        .limit(50);

      if (videosError) {
        throw videosError;
      }

      if (!videos || videos.length === 0) {
        throw new Error("Add at least one video before generating a report.");
      }

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videos }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not generate AI report.");
      }

      setReport(result);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Could not generate AI report.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-3">
              <Sparkles className="text-violet-400" />
              <h2 className="text-xl font-semibold">
                Personalized AI Report
              </h2>
            </div>

            <p className="mt-2 text-sm text-zinc-400">
              Analyze your latest videos and generate recommendations.
            </p>
          </div>

          <Button
            onClick={generateReport}
            disabled={loading}
            className="bg-violet-600 text-white hover:bg-violet-500"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Generate Report
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </Card>

      {report && (
        <>
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <Card className="border-violet-500/30 bg-violet-500/10 p-6 text-white">
              <div className="flex items-center gap-3">
                <Star className="text-violet-400" />
                <p className="font-medium">Creator Score</p>
              </div>

              <p className="mt-6 text-6xl font-bold">
                {Math.max(0, Math.min(100, report.score))}
              </p>

              <p className="mt-2 text-zinc-400">Out of 100</p>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
              <h2 className="text-xl font-semibold">AI Summary</h2>

              <p className="mt-4 max-w-4xl text-base leading-8 text-zinc-300">
                {report.summary}
              </p>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ReportList
              title="Strengths"
              items={report.strengths}
              icon={<CheckCircle2 className="text-green-400" />}
            />

            <ReportList
              title="Improvements"
              items={report.improvements}
              icon={<TrendingUp className="text-yellow-400" />}
            />
          </div>

          <Card className="border-violet-500/30 bg-zinc-900 p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-violet-500/15 p-3">
                <Lightbulb className="text-violet-400" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Next Video Idea
                </h2>

                <p className="mt-3 leading-7 text-zinc-300">
                  {report.nextVideoIdea}
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function ReportList({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <div
            key={`${title}-${index}`}
            className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-sm leading-6 text-zinc-300"
          >
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
}