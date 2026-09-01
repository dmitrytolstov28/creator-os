"use client";

import {
  Eye,
  Play,
  Heart,
  MessageCircle,
  TrendingUp,
  Activity,
} from "lucide-react";

import ContentActions from "@/components/ContentActions";

type ContentCardProps = {
  id: number;
  title: string;
  platform?: string;
  views?: number;
  likes?: number;
  comments?: number;
  status?: string;
  type?: string;
  thumbnail?: string;
  onUpdated?: () => void;
};

export default function ContentCard({
  id,
  title,
  platform,
  views,
  likes,
  comments,
  status,
  type,
  thumbnail,
  onUpdated,
}: ContentCardProps) {
  const engagement =
    views && views > 0
      ? (
          (((likes ?? 0) +
            (comments ?? 0)) /
            views) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-emerald-400/20
        bg-white/[0.035]
        backdrop-blur-2xl
        transition-all
        duration-300
        hover:border-emerald-400/50
        hover:shadow-[0_0_40px_rgba(0,255,136,0.18)]
      "
    >
      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-40
          w-40
          rounded-full
          bg-emerald-400/10
          blur-3xl
        "
      />

      {/* Preview */}

      <div
        className="
          relative
          flex
          h-44
          items-center
          justify-center
          overflow-hidden
          bg-black/40
        "
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="
              h-full
              w-full
              object-cover
              opacity-80
              transition
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <Play
            size={42}
            className="text-emerald-400/50"
          />
        )}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/60
            to-transparent
          "
        />

        <div
          className="
            absolute
            left-3
            top-3
            flex
            items-center
            gap-2
            rounded-full
            border
            border-emerald-400/30
            bg-black/50
            px-3
            py-1
            text-xs
            text-emerald-300
            backdrop-blur-xl
          "
        >
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-emerald-400
              shadow-[0_0_10px_rgba(0,255,136,1)]
            "
          />

          ACTIVE NODE
        </div>

        <div className="absolute right-3 top-3">
          <ContentActions
            video={{
              id,
              title,
              platform:
                platform ?? "",
              views: views ?? 0,
              likes: likes ?? 0,
              comments:
                comments ?? 0,
            }}
            onUpdated={
              onUpdated
            }
          />
        </div>
      </div>

      {/* Data */}

      <div className="relative p-5">
        <div className="flex justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white">
              {title}
            </h3>

            <p
              className="
                mt-1
                text-xs
                uppercase
                tracking-[0.2em]
                text-emerald-400/70
              "
            >
              {type ?? "Video"}
            </p>
          </div>

          <Play
            size={18}
            className="text-emerald-400"
          />
        </div>

        <div className="mt-5 space-y-3 text-sm">
          {platform && (
            <div className="flex justify-between">
              <span className="text-zinc-500">
                Platform
              </span>

              <span className="text-white">
                {platform}
              </span>
            </div>
          )}

          {[
            {
              icon: Eye,
              label: "Views",
              value: views,
            },
            {
              icon: Heart,
              label: "Likes",
              value: likes,
            },
            {
              icon: MessageCircle,
              label: "Comments",
              value: comments,
            },
          ].map((item) => {
            const Icon =
              item.icon;

            return (
              item.value !==
                undefined && (
                <div
                  key={
                    item.label
                  }
                  className="flex justify-between"
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      text-zinc-400
                    "
                  >
                    <Icon
                      size={15}
                    />

                    {item.label}
                  </span>

                  <span className="text-white">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              )
            );
          })}

          <div className="flex justify-between">
            <span
              className="
                flex
                items-center
                gap-2
                text-zinc-400
              "
            >
              <TrendingUp
                size={15}
              />

              Engagement
            </span>

            <span className="text-emerald-400">
              {engagement}%
            </span>
          </div>
        </div>

        <div
          className="
            mt-5
            flex
            items-center
            gap-2
            border-t
            border-emerald-400/10
            pt-4
            text-xs
            text-emerald-400
          "
        >
          <Activity size={14} />

          SYSTEM TRACKING ACTIVE
        </div>
      </div>
    </div>
  );
}