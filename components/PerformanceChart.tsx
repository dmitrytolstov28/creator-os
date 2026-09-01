"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  getVideos,
  Video,
} from "@/lib/analytics";

type PostedVideo = {
  title: string;
  views: number;
};

type ChartPoint = {
  dateKey: string;
  date: string;
  fullDate: string;
  views: number;
  videoCount: number;
  videos: PostedVideo[];
};

function formatDate(
  dateKey: string,
) {
  const date = new Date(
    `${dateKey}T00:00:00`,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return {
      short: dateKey,
      full: dateKey,
    };
  }

  return {
    short:
      date.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        },
      ),

    full:
      date.toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        },
      ),
  };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: ChartPoint;
  }>;
}) {
  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null;
  }

  const point =
    payload[0].payload;

  return (
    <div
      className="
        min-w-[190px]
        rounded-xl
        border
        border-emerald-400/30
        bg-[#020604]
        p-3
        shadow-xl
      "
    >
      <p className="font-semibold text-white">
        {point.fullDate}
      </p>

      <p className="mt-1 text-sm font-semibold text-emerald-400">
        {point.views.toLocaleString()}{" "}
        {point.videoCount === 1
          ? "views"
          : "total views"}
      </p>

      {point.videoCount > 1 && (
        <p className="mt-1 text-xs text-zinc-500">
          {point.videoCount} videos
          posted
        </p>
      )}

      <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
        {point.videos.map(
          (
            video,
            index,
          ) => (
            <div
              key={`${video.title}-${index}`}
            >
              <p className="max-w-[240px] truncate text-xs text-zinc-300">
                {video.title}
              </p>

              <p className="text-xs text-emerald-400">
                {video.views.toLocaleString()}{" "}
                views
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default function PerformanceChart() {
  const [
    data,
    setData,
  ] =
    useState<
      ChartPoint[]
    >([]);

  useEffect(() => {
    async function loadData() {
      try {
        const videos =
          await getVideos();

        /*
         * Only use the actual
         * Instagram publishing date.
         *
         * If date_posted is missing,
         * the video is not plotted.
         */
        const postedVideos =
          videos.filter(
            (
              video: Video,
            ) =>
              Boolean(
                video.date_posted,
              ),
          );

        /*
         * Group videos by the actual
         * date they were posted.
         *
         * This prevents duplicate
         * X-axis dates.
         */
        const grouped =
          new Map<
            string,
            {
              views: number;
              videos: PostedVideo[];
            }
          >();

        postedVideos.forEach(
          (
            video: Video,
          ) => {
            if (
              !video.date_posted
            ) {
              return;
            }

            const dateKey =
              video.date_posted.slice(
                0,
                10,
              );

            const current =
              grouped.get(
                dateKey,
              ) ?? {
                views: 0,
                videos: [],
              };

            const videoViews =
              video.views ?? 0;

            current.views +=
              videoViews;

            current.videos.push(
              {
                title:
                  video.title ||
                  "Untitled Video",

                views:
                  videoViews,
              },
            );

            grouped.set(
              dateKey,
              current,
            );
          },
        );

        /*
         * Convert grouped dates into
         * chart points and sort
         * oldest -> newest.
         */
        const chartData =
          Array.from(
            grouped.entries(),
          )
            .sort(
              ([dateA], [
                dateB,
              ]) =>
                dateA.localeCompare(
                  dateB,
                ),
            )
            .map(
              ([
                dateKey,
                group,
              ]) => {
                const formatted =
                  formatDate(
                    dateKey,
                  );

                return {
                  dateKey,

                  date:
                    formatted.short,

                  fullDate:
                    formatted.full,

                  views:
                    group.views,

                  videoCount:
                    group.videos
                      .length,

                  videos:
                    group.videos,
                };
              },
            );

        setData(
          chartData,
        );
      } catch (error) {
        console.error(
          "PERFORMANCE CHART ERROR:",
          error,
        );
      }
    }

    void loadData();
  }, []);

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-emerald-400/20
        bg-white/[0.04]
        p-6
        backdrop-blur-xl
        shadow-[0_0_35px_rgba(0,255,136,0.08)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-64
          w-64
          rounded-full
          bg-emerald-400/10
          blur-3xl
        "
      />

      <div className="relative z-10">
        <div className="mb-6">
          <p
            className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-emerald-400/70
            "
          >
            Growth Telemetry
          </p>

          <h2
            className="
              mt-2
              text-xl
              font-semibold
              text-white
            "
          >
            Performance Trend
          </h2>

          <p className="text-sm text-zinc-400">
            Views by actual Instagram posting date.
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={
                data
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,255,136,0.12)"
              />

              <XAxis
                dataKey="date"
                stroke="#71717a"
                tick={{
                  fill:
                    "#71717a",
                  fontSize:
                    12,
                }}
                interval={
                  0
                }
                minTickGap={
                  12
                }
              />

              <YAxis
                stroke="#71717a"
                tick={{
                  fill:
                    "#71717a",
                  fontSize:
                    12,
                }}
              />

              <Tooltip
                content={
                  <CustomTooltip />
                }
              />

              <Line
                type="monotone"
                dataKey="views"
                stroke="#00ff88"
                strokeWidth={
                  3
                }
                dot={{
                  fill:
                    "#00ff88",
                  r: 4,
                }}
                activeDot={{
                  r: 7,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}