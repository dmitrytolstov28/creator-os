"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  Brain,
  Eye,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Activity,
  Video as VideoIcon,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PerformanceChart from "@/components/PerformanceChart";
import IntelligenceScore from "@/components/IntelligenceScore";
import AIInsights from "@/components/AIInsights";

import {
  getVideos,
  calculateTotals,
  getEngagementRate,
  Video,
} from "@/lib/analytics";

export default function Home() {
  const [videos, setVideos] =
    useState<Video[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const videoData =
          await getVideos();

        setVideos(videoData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  const totals =
    calculateTotals(videos);

  const engagement =
    getEngagementRate(videos);

  const topVideo =
    useMemo(() => {
      if (videos.length === 0) {
        return null;
      }

      return [...videos].sort(
        (a, b) =>
          (b.views ?? 0) -
          (a.views ?? 0),
      )[0];
    }, [videos]);

  const recentVideos =
    useMemo(() => {
      return [...videos]
        .sort((a, b) => {
          const aDate =
            a.created_at
              ? new Date(
                  a.created_at,
                ).getTime()
              : 0;

          const bDate =
            b.created_at
              ? new Date(
                  b.created_at,
                ).getTime()
              : 0;

          return bDate - aDate;
        })
        .slice(0, 4);
    }, [videos]);

  const pipeline = [
    {
      label: "Total Views",
      value: loading
        ? "..."
        : totals.views.toLocaleString(),
      icon: Eye,
    },
    {
      label: "Engagement Rate",
      value: loading
        ? "..."
        : `${engagement.toFixed(1)}%`,
      icon: TrendingUp,
    },
    {
      label: "Content Published",
      value: loading
        ? "..."
        : totals.videos.toString(),
      icon: Activity,
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}

        <div>
          <p
            className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-emerald-400/70
            "
          >
            Creator Command Center
          </p>

          <h1
            className="
              mt-3
              text-5xl
              font-bold
              text-white
            "
          >
            Welcome back 👋
          </h1>

          <p className="mt-2 text-zinc-400">
            Track performance, study what works, and generate your next content ideas.
          </p>
        </div>

        {/* Actions */}

        <div className="flex flex-wrap gap-4">
          <Link
            href="/ideas"
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-emerald-400
              px-5
              py-3
              font-semibold
              text-black
              transition
              hover:bg-emerald-300
            "
          >
            <Sparkles size={18} />

            Generate Ideas
          </Link>

          <Link
            href="/videos"
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-emerald-400/30
              bg-white/[0.04]
              px-5
              py-3
              text-white
              transition
              hover:bg-white/10
            "
          >
            View Videos

            <ArrowRight size={18} />
          </Link>

          <Link
            href="/analytics"
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-emerald-400/30
              bg-white/[0.04]
              px-5
              py-3
              text-white
              transition
              hover:bg-white/10
            "
          >
            View Analytics

            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Performance Summary */}

        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">
            Performance Overview
          </h2>

          <div
            className="
              grid
              gap-4
              md:grid-cols-3
            "
          >
            {pipeline.map((item) => {
              const Icon =
                item.icon;

              return (
                <div
                  key={item.label}
                  className="
                    rounded-2xl
                    border
                    border-emerald-400/20
                    bg-white/[0.04]
                    p-5
                  "
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-400">
                      {item.label}
                    </p>

                    <Icon
                      size={20}
                      className="text-emerald-400"
                    />
                  </div>

                  <p
                    className="
                      mt-3
                      text-4xl
                      font-bold
                      text-white
                    "
                  >
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid */}

        <div
          className="
            grid
            gap-6
            xl:grid-cols-2
          "
        >
          {/* Recent Content */}

          <div
            className="
              rounded-2xl
              border
              border-emerald-400/20
              bg-white/[0.04]
              p-6
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-400/70">
                  Latest Activity
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Recent Videos
                </h2>
              </div>

              <VideoIcon
                size={20}
                className="text-emerald-400"
              />
            </div>

            <div className="mt-5 space-y-3">
              {loading ? (
                <p className="text-zinc-400">
                  Loading recent content...
                </p>
              ) : recentVideos.length ===
                0 ? (
                <p className="text-zinc-400">
                  No published videos yet.
                </p>
              ) : (
                recentVideos.map(
                  (video) => (
                    <Link
                      key={
                        video.id
                      }
                      href={`/videos/${video.id}`}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-xl
                        border
                        border-emerald-400/10
                        bg-black/20
                        p-4
                        transition
                        hover:border-emerald-400/30
                        hover:bg-black/30
                      "
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {video.title ||
                            "Untitled Video"}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {video.platform ||
                            "Instagram"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-emerald-300">
                          {(
                            video.views ??
                            0
                          ).toLocaleString()}
                        </p>

                        <p className="text-xs text-zinc-500">
                          views
                        </p>
                      </div>
                    </Link>
                  ),
                )
              )}
            </div>

            <Link
              href="/videos"
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-emerald-300
                transition
                hover:text-emerald-200
              "
            >
              View all videos

              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Performance */}

          <div
            className="
              rounded-2xl
              border
              border-emerald-400/20
              bg-white/[0.04]
              p-6
            "
          >
            <PerformanceChart />
          </div>
        </div>

        {/* Best Video + AI */}

        <div
          className="
            grid
            gap-6
            xl:grid-cols-2
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-emerald-400/20
              bg-white/[0.04]
              p-6
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-400/70">
                  Strongest Performer
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Top Video
                </h2>
              </div>

              <TrendingUp
                size={20}
                className="text-emerald-400"
              />
            </div>

            {loading ? (
              <p className="mt-5 text-zinc-400">
                Loading performance...
              </p>
            ) : !topVideo ? (
              <p className="mt-5 text-zinc-400">
                No video data available yet.
              </p>
            ) : (
              <div className="mt-5">
                <p className="text-lg font-semibold text-white">
                  {topVideo.title ||
                    "Untitled Video"}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div
                    className="
                      rounded-xl
                      border
                      border-emerald-400/10
                      bg-black/20
                      p-4
                    "
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Views
                    </p>

                    <p className="mt-1 text-xl font-bold text-white">
                      {(
                        topVideo.views ??
                        0
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl
                      border
                      border-emerald-400/10
                      bg-black/20
                      p-4
                    "
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Platform
                    </p>

                    <p className="mt-1 text-xl font-bold text-white">
                      {topVideo.platform ||
                        "Instagram"}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/videos/${topVideo.id}`}
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-emerald-300
                    transition
                    hover:text-emerald-200
                  "
                >
                  Open video

                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>

          <div
            className="
              rounded-2xl
              border
              border-emerald-400/20
              bg-emerald-400/[0.04]
              p-6
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-400/30
                  bg-emerald-400/10
                "
              >
                <Brain
                  size={21}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-400/70">
                  AI Content Engine
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Generate Your Next Ideas
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  CreatorOS analyzes your synced Instagram performance and turns those patterns into new content ideas.
                </p>

                <Link
                  href="/ideas"
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-emerald-400
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-black
                    transition
                    hover:bg-emerald-300
                  "
                >
                  <Lightbulb size={16} />

                  Generate Ideas
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Intelligence */}

        <div
          className="
            grid
            gap-6
            xl:grid-cols-2
          "
        >
          <IntelligenceScore />

          <AIInsights />
        </div>
      </div>
    </AppShell>
  );
}