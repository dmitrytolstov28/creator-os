"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Video,
  PlayCircle,
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getVideos,
  Video as VideoType,
  calculateTotals,
} from "@/lib/analytics";

type LibraryVideo =
  VideoType & {
    date_posted?: string | null;
    created_at?: string;
  };

function PlatformBadge({
  platform,
}: {
  platform: string;
}) {
  const name =
    platform.toLowerCase();

  if (
    name.includes("youtube") ||
    name.includes("yt")
  ) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-xs font-semibold text-white">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-red-500 text-[9px] font-bold">
          YT
        </span>

        YouTube
      </div>
    );
  }

  if (
    name.includes("tiktok") ||
    name.includes("tik tok") ||
    name.includes("tik")
  ) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-xs font-semibold text-white">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-[9px] font-bold text-black">
          TT
        </span>

        TikTok
      </div>
    );
  }

  if (
    name.includes("instagram") ||
    name.includes("insta") ||
    name.includes("ig")
  ) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-xs font-semibold text-white">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-[9px] font-bold">
          IG
        </span>

        Instagram
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-xs font-semibold text-white">
      {platform}
    </div>
  );
}

function getVideoDate(
  video: LibraryVideo,
) {
  return (
    video.date_posted ||
    video.created_at ||
    ""
  );
}

function formatPostedDate(
  value?: string | null,
) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(
    `${value.slice(
      0,
      10,
    )}T00:00:00`,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}

function VideoThumbnail({
  video,
}: {
  video: LibraryVideo;
}) {
  const [
    imageFailed,
    setImageFailed,
  ] = useState(false);

  const hasThumbnail =
    Boolean(
      video.thumbnail_url,
    ) &&
    !imageFailed;

  return (
    <div className="relative overflow-hidden rounded-xl bg-black">
      {hasThumbnail ? (
        <img
          src={
            video.thumbnail_url ??
            ""
          }
          alt={
            video.title
          }
          className="aspect-[9/13] w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            setImageFailed(true);
          }}
        />
      ) : (
        <div className="flex aspect-[9/13] items-center justify-center bg-gradient-to-b from-zinc-950 to-black">
          <div className="flex flex-col items-center gap-3 text-zinc-600">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/5">
              <Video
                size={28}
                className="text-emerald-400/60"
              />
            </div>

            <span className="text-xs text-zinc-500">
              Preview unavailable
            </span>
          </div>
        </div>
      )}

      <div className="absolute left-2.5 top-2.5">
        <PlatformBadge
          platform={
            video.platform
          }
        />
      </div>

      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg bg-black/80 px-2.5 py-1.5 text-xs font-semibold text-white">
        <Eye size={14} />

        {video.views.toLocaleString()}
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [
    videos,
    setVideos,
  ] =
    useState<
      LibraryVideo[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const data =
          await getVideos();

        setVideos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void loadVideos();
  }, []);

  const sortedVideos =
    useMemo(() => {
      return [...videos].sort(
        (a, b) => {
          const aDate =
            getVideoDate(a);

          const bDate =
            getVideoDate(b);

          if (
            !aDate &&
            !bDate
          ) {
            return 0;
          }

          if (!aDate) {
            return 1;
          }

          if (!bDate) {
            return -1;
          }

          return bDate.localeCompare(
            aDate,
          );
        },
      );
    }, [videos]);

  const totals =
    calculateTotals(videos);

  return (
    <AppShell>
      <div className="space-y-7">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/70">
              Content Creation
            </p>

            <h1 className="mt-2 text-4xl font-bold text-white">
              Video Library
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Manage your published content and track performance.
            </p>
          </div>

          <Link
            href="/videos/new"
            className="
              flex
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
            <Plus size={17} />

            Add Published Video
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-4">
            <Video
              size={20}
              className="text-emerald-400"
            />

            <p className="mt-2.5 text-sm text-zinc-400">
              Total Videos
            </p>

            <p className="mt-1.5 text-2xl font-bold text-white">
              {totals.videos}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-4">
            <PlayCircle
              size={20}
              className="text-emerald-400"
            />

            <p className="mt-2.5 text-sm text-zinc-400">
              Published
            </p>

            <p className="mt-1.5 text-2xl font-bold text-white">
              {
                sortedVideos.length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-4">
            <BarChart3
              size={20}
              className="text-emerald-400"
            />

            <p className="mt-2.5 text-sm text-zinc-400">
              Total Views
            </p>

            <p className="mt-1.5 text-2xl font-bold text-white">
              {totals.views.toLocaleString()}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-zinc-500">
            Loading videos...
          </div>
        ) : sortedVideos.length ===
          0 ? (
          <div className="py-10 text-zinc-500">
            No videos found.
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-[repeat(auto-fill,minmax(190px,1fr))]
              gap-5
              2xl:grid-cols-6
            "
          >
            {sortedVideos.map(
              (video) => (
                <Link
                  key={
                    video.id
                  }
                  href={`/videos/${video.id}`}
                  className="
                    min-w-0
                    rounded-2xl
                    border
                    border-emerald-400/20
                    bg-white/[0.04]
                    p-3
                    transition
                    hover:-translate-y-1
                    hover:border-emerald-400/50
                  "
                >
                  <VideoThumbnail
                    video={
                      video
                    }
                  />

                  <div className="mt-4 space-y-3">
                    <h2 className="text-base font-bold leading-tight text-white">
                      {
                        video.title
                      }
                    </h2>

                    <div className="space-y-1.5 text-xs text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Eye
                          size={
                            15
                          }
                        />

                        {video.views.toLocaleString()}{" "}
                        views
                      </div>

                      <div className="flex items-center gap-2">
                        <Heart
                          size={
                            15
                          }
                        />

                        {video.likes.toLocaleString()}{" "}
                        likes
                      </div>

                      <div className="flex items-center gap-2">
                        <MessageCircle
                          size={
                            15
                          }
                        />

                        {video.comments.toLocaleString()}{" "}
                        comments
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-xs text-zinc-500">
                      <span>
                        Posted{" "}
                        {formatPostedDate(
                          video.date_posted,
                        )}
                      </span>

                      <MoreHorizontal
                        size={
                          17
                        }
                      />
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}