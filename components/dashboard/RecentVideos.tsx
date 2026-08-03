import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const videos = [
  {
    title: "Gym POV",
    platform: "TikTok",
    views: "390K",
    engagement: "16.2%",
    status: "Top performer",
  },
  {
    title: "Morning Routine",
    platform: "Instagram",
    views: "245K",
    engagement: "12.8%",
    status: "Growing",
  },
  {
    title: "Creator Advice",
    platform: "TikTok",
    views: "185K",
    engagement: "10.4%",
    status: "Average",
  },
];

export default function RecentVideos() {
  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recent Videos</h2>

          <p className="mt-1 text-sm text-zinc-400">
            Your latest content performance
          </p>
        </div>

        <button className="flex items-center gap-2 text-sm text-violet-400 transition hover:text-violet-300">
          View all
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {videos.map((video) => (
          <div
            key={video.title}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/30 p-4"
          >
            <div>
              <h3 className="font-medium text-white">{video.title}</h3>

              <p className="mt-1 text-sm text-zinc-500">
                {video.platform}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-semibold text-white">{video.views}</p>

                <p className="text-xs text-zinc-500">Views</p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-white">
                  {video.engagement}
                </p>

                <p className="text-xs text-zinc-500">Engagement</p>
              </div>

              <Badge
                variant="outline"
                className="border-violet-500/30 bg-violet-500/10 text-violet-300"
              >
                {video.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}