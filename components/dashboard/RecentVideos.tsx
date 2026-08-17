"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

type Video = {
  id: number;
  title: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
};

function formatViews(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function RecentVideos() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    async function loadVideos() {
      const { data } = await supabase
        .from("videos")
        .select(
          "id,title,platform,views,likes,comments,shares,saves"
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (data) {
        setVideos(data);
      }
    }

    loadVideos();
  }, []);

  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recent Videos</h2>

          <p className="mt-1 text-sm text-zinc-400">
            Your latest uploads
          </p>
        </div>

        <Link
          href="/videos"
          className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
        >
          View all
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {videos.length === 0 ? (
          <p className="text-zinc-500">
            No videos yet.
          </p>
        ) : (
          videos.map((video) => {
            const engagement =
              video.views > 0
                ? (
                    ((video.likes +
                      video.comments +
                      video.shares +
                      video.saves) /
                      video.views) *
                    100
                  ).toFixed(1)
                : "0.0";

            return (
              <div
                key={video.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/30 p-4"
              >
                <div>
                  <h3 className="font-medium">
                    {video.title}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    {video.platform}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatViews(video.views)}
                    </p>

                    <p className="text-xs text-zinc-500">
                      Views
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {engagement}%
                    </p>

                    <p className="text-xs text-zinc-500">
                      Engagement
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className="border-violet-500/30 bg-violet-500/10 text-violet-300"
                  >
                    Live
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}