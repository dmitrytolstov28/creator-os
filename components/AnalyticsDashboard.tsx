"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Users,
  Activity,
  BarChart3,
} from "lucide-react";

import StatCard from "@/components/StatCard";

import {
  getVideos,
  calculateTotals,
  Video,
} from "@/lib/analytics";

import PerformanceChart from "@/components/PerformanceChart";

export default function AnalyticsDashboard() {
  const [
    videos,
    setVideos,
  ] =
    useState<Video[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data =
          await getVideos();

        setVideos(
          data,
        );
      } catch (error) {
        console.error(
          error,
        );
      } finally {
        setLoading(
          false,
        );
      }
    }

    void loadData();
  }, []);

  const totals =
    calculateTotals(
      videos,
    );

  const stats = [
    {
      label:
        "Total Reach",
      value:
        totals.views.toLocaleString(),
      icon:
        Eye,
    },

    {
      label:
        "Likes",
      value:
        totals.likes.toLocaleString(),
      icon:
        Heart,
    },

    {
      label:
        "Comments",
      value:
        totals.comments.toLocaleString(),
      icon:
        MessageCircle,
    },

    {
      label:
        "Shares",
      value:
        totals.shares.toLocaleString(),
      icon:
        Share2,
    },

    {
      label:
        "Saved",
      value:
        totals.saves.toLocaleString(),
      icon:
        Bookmark,
    },

    {
      label:
        "Followers",
      value:
        totals.followers.toLocaleString(),
      icon:
        Users,
    },
  ];

  const topVideos =
    [...videos]
      .sort(
        (
          a,
          b,
        ) =>
          b.views -
          a.views,
      )
      .slice(
        0,
        5,
      );

  return (
    <div className="space-y-7">
      {/* Header */}

      <div>
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <Activity
            size={17}
            className="text-emerald-400"
          />

          <p
            className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-emerald-400/70
            "
          >
            Growth Intelligence
          </p>
        </div>

        <h1
          className="
            mt-3
            text-4xl
            font-bold
            text-white
          "
        >
          Analytics Command Center
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Track your content performance
          and audience growth.
        </p>
      </div>

      {/* Stats */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
          lg:grid-cols-3
          2xl:grid-cols-6
        "
      >
        {stats.map(
          (
            stat,
          ) => (
            <StatCard
              key={
                stat.label
              }
              label={
                loading
                  ? "Loading..."
                  : stat.label
              }
              value={
                loading
                  ? "..."
                  : stat.value
              }
              icon={
                stat.icon
              }
            />
          ),
        )}
      </div>

      {/* Performance Trend */}

      <div
        className="
          rounded-2xl
          border
          border-emerald-400/20
          bg-white/[0.04]
          p-5
          backdrop-blur-xl
        "
      >
        <div
          className="
            mb-4
            flex
            items-center
            gap-3
          "
        >
          <BarChart3
            size={18}
            className="text-emerald-400"
          />

          <p
            className="
              text-xs
              uppercase
              tracking-[0.22em]
              text-zinc-400
            "
          >
            Performance Trend
          </p>
        </div>

        <PerformanceChart />
      </div>

      {/* Top Performing Content */}

      <div
        className="
          rounded-2xl
          border
          border-emerald-400/20
          bg-white/[0.04]
          p-5
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <Activity
            size={18}
            className="text-emerald-400"
          />

          <h2
            className="
              text-lg
              font-semibold
              text-white
            "
          >
            Top Performing Content
          </h2>
        </div>

        <div className="mt-4 space-y-2.5">
          {topVideos.length ===
          0 ? (
            <p className="text-sm text-zinc-400">
              Add videos to see
              performance data.
            </p>
          ) : (
            topVideos.map(
              (
                video,
                index,
              ) => (
                <div
                  key={
                    video.id
                  }
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-xl
                    border
                    border-emerald-400/10
                    bg-black/20
                    px-4
                    py-3
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-emerald-400/15
                        bg-emerald-400/[0.06]
                        text-xs
                        font-semibold
                        text-emerald-400
                      "
                    >
                      {index +
                        1}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {
                          video.title
                        }
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-500">
                        {
                          video.platform
                        }
                      </p>
                    </div>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-emerald-400">
                    {video.views.toLocaleString()}{" "}
                    views
                  </p>
                </div>
              ),
            )
          )}
        </div>
      </div>
    </div>
  );
}