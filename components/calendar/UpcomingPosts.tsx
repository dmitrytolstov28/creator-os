"use client";

import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const posts = [
  {
    title: "Morning Routine",
    platform: "TikTok",
    date: "Aug 3 • 6:00 PM",
  },
  {
    title: "Gym Vlog",
    platform: "Instagram",
    date: "Aug 8 • 5:30 PM",
  },
  {
    title: "AI Productivity Tips",
    platform: "YouTube",
    date: "Aug 13 • 7:00 PM",
  },
];

export default function UpcomingPosts() {
  return (
    <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upcoming Posts</h2>

        <button className="rounded-lg p-2 transition hover:bg-zinc-800">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.title}
            className="rounded-xl border border-zinc-800 bg-zinc-800/50 p-4 transition hover:border-violet-500"
          >
            <h3 className="font-medium">{post.title}</h3>

            <p className="mt-1 text-sm text-zinc-400">
              {post.platform}
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              {post.date}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}