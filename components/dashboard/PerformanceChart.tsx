"use client";

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

const data = [
  { day: "Mon", views: 120000 },
  { day: "Tue", views: 185000 },
  { day: "Wed", views: 160000 },
  { day: "Thu", views: 245000 },
  { day: "Fri", views: 310000 },
  { day: "Sat", views: 280000 },
  { day: "Sun", views: 390000 },
];

export default function PerformanceChart() {
  return (
    <Card className="mt-6 rounded-2xl border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Performance</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Views from the last seven days
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400">
          Last 7 days
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="currentColor"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="currentColor"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#27272a"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}K`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "12px",
              }}
              labelStyle={{ color: "#ffffff" }}
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