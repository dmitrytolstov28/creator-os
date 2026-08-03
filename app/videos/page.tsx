"use client";

import { useState } from "react";
import { Plus, Search, Video } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type VideoEntry = {
  id: number;
  title: string;
  platform: string;
  views: string;
  likes: string;
  comments: string;
};

const startingVideos: VideoEntry[] = [
  {
    id: 1,
    title: "Gym POV",
    platform: "TikTok",
    views: "390000",
    likes: "52000",
    comments: "1200",
  },
  {
    id: 2,
    title: "Morning Routine",
    platform: "Instagram",
    views: "245000",
    likes: "31000",
    comments: "890",
  },
];

export default function VideosPage() {
  const [videos, setVideos] = useState(startingVideos);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase()),
  );

  function addVideo(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim();
    const platform = String(formData.get("platform") ?? "").trim();
    const views = String(formData.get("views") ?? "0");
    const likes = String(formData.get("likes") ?? "0");
    const comments = String(formData.get("comments") ?? "0");

    if (!title || !platform) return;

    setVideos((current) => [
      {
        id: Date.now(),
        title,
        platform,
        views,
        likes,
        comments,
      },
      ...current,
    ]);

    setShowForm(false);
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Videos</h1>

          <p className="mt-2 text-zinc-400">
            Store and analyze all of your published content.
          </p>
        </div>

        <Button
          onClick={() => setShowForm((current) => !current)}
          className="bg-violet-600 text-white hover:bg-violet-500"
        >
          <Plus size={18} />
          Add Video
        </Button>
      </div>

      {showForm && (
        <Card className="mt-8 border-zinc-800 bg-zinc-900 p-6 text-white">
          <h2 className="text-xl font-semibold">Add a new video</h2>

          <form action={addVideo} className="mt-6 grid gap-4 md:grid-cols-2">
            <Input
              name="title"
              placeholder="Video title"
              required
              className="border-zinc-700 bg-black text-white"
            />

            <Input
              name="platform"
              placeholder="Platform, such as TikTok"
              required
              className="border-zinc-700 bg-black text-white"
            />

            <Input
              name="views"
              type="number"
              placeholder="Views"
              className="border-zinc-700 bg-black text-white"
            />

            <Input
              name="likes"
              type="number"
              placeholder="Likes"
              className="border-zinc-700 bg-black text-white"
            />

            <Input
              name="comments"
              type="number"
              placeholder="Comments"
              className="border-zinc-700 bg-black text-white"
            />

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-violet-600 text-white hover:bg-violet-500"
              >
                Save Video
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-zinc-700 bg-transparent text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="relative mt-8 max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search videos"
          className="border-zinc-800 bg-zinc-950 pl-10 text-white"
        />
      </div>

      <div className="mt-6 space-y-4">
        {filteredVideos.map((video) => (
          <Card
            key={video.id}
            className="flex items-center justify-between border-zinc-800 bg-zinc-900 p-5 text-white"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-violet-500/15 p-3">
                <Video size={20} className="text-violet-400" />
              </div>

              <div>
                <h2 className="font-semibold">{video.title}</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {video.platform}
                </p>
              </div>
            </div>

            <div className="flex gap-10 text-right">
              <Metric label="Views" value={video.views} />
              <Metric label="Likes" value={video.likes} />
              <Metric label="Comments" value={video.comments} />
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="font-semibold text-white">
        {Number(value).toLocaleString()}
      </p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}