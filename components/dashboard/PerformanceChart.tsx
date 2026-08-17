"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

type ChartData = {
  day: string;
  views: number;
};

export default function PerformanceChart() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function loadChart() {
      const { data: videos } = await supabase
        .from("videos")
        .select("date_posted, views")
        .not("date_posted", "is", null)
        .order("date_posted", { ascending: true });

      if (!videos) return;

      const grouped = new Map<string, number>();

      videos.forEach((video) => {
        if (!video.date_posted) return;

        const day = new Date(video.date_posted).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        grouped.set(day, (grouped.get(day) ?? 0) + (video.views ?? 0));
      });

      setData(
        Array.from(grouped.entries()).map(([day, views]) => ({
          day,
          views,
        }))
      );
    }

    loadChart();
  }, []);

  return (
    <Card className="mt-6 rounded-2xl border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Performance
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Views over time
          </p>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="viewsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#8b5cf6"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="#8b5cf6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#27272a"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toLocaleString()}
            />

            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "12px",
              }}
              formatter={(value) => [
                Number(value).toLocaleString(),
                "Views",
              ]}
            />

            <Area
              type="monotone"
              dataKey="views"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#viewsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}