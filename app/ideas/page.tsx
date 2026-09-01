"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  BarChart3,
  Brain,
  Bookmark,
  Eye,
  Hash,
  Lightbulb,
  Link2,
  Loader2,
  Medal,
  MousePointer2,
  Share2,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  WandSparkles,
} from "lucide-react";

import { toast } from "sonner";

import AppShell from "@/components/layout/AppShell";

import { supabase } from "@/lib/supabase";

type GeneratedIdea = {
  title: string;
  hook: string;
  concept: string;
  content_type: string;
  suggested_hashtags: string[];
  why_it_should_work: string;
  based_on: string;
};

type TopVideo = {
  title: string;
  views: number;
  performanceScore?: number;
  datePosted?: string | null;
};

type Intelligence = {
  averageViews: number;
  engagementRate: number;
  saveRate: number;
  shareRate: number;
  topVideo: TopVideo | null;
};

type GenerateResponse = {
  ideas?: GeneratedIdea[];
  analyzedVideos?: number;
  intelligence?: Intelligence;
  error?: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(
    Math.round(value),
  );
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return null;
  }

  const date = new Date(
    `${value.slice(0, 10)}T00:00:00`,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}

export default function IdeasPage() {
  const [request, setRequest] =
    useState("");

  const [ideas, setIdeas] =
    useState<GeneratedIdea[]>([]);

  const [
    analyzedVideos,
    setAnalyzedVideos,
  ] = useState(0);

  const [
    intelligence,
    setIntelligence,
  ] =
    useState<Intelligence | null>(
      null,
    );

  const [
    generating,
    setGenerating,
  ] = useState(false);

  const [
    needsInstagramConnection,
    setNeedsInstagramConnection,
  ] = useState(false);

  async function generateIdeas(
    event?: FormEvent<HTMLFormElement>,
  ) {
    event?.preventDefault();

    try {
      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          "Unable to verify your login session.",
        );
      }

      const accessToken =
        sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error(
          "Your session has expired. Please log in again.",
        );
      }

      const {
        data: instagramConnection,
        error: instagramConnectionError,
      } = await supabase
        .from(
          "instagram_connections",
        )
        .select("id")
        .limit(1)
        .maybeSingle();

      if (instagramConnectionError) {
        throw new Error(
          "Could not check your Instagram connection.",
        );
      }

      if (!instagramConnection) {
        setNeedsInstagramConnection(
          true,
        );

        toast.error(
          "Connect Instagram first",
          {
            description:
              "CreatorOS needs your Instagram content before it can generate account-specific ideas.",
          },
        );

        return;
      }

      setNeedsInstagramConnection(
        false,
      );

      setGenerating(true);

      const response =
        await fetch(
          "/api/ideas/generate",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${accessToken}`,
            },

            body: JSON.stringify({
              request:
                request.trim(),
            }),
          },
        );

      const data =
        (await response.json()) as GenerateResponse;

      if (!response.ok) {
        if (
          data.error ===
          "No videos found. Sync Instagram first."
        ) {
          toast.error(
            "Sync your Instagram content first",
            {
              description:
                "Your Instagram account is connected, but CreatorOS does not have any synced videos yet.",
            },
          );

          return;
        }

        throw new Error(
          data.error ||
            "Could not generate ideas",
        );
      }

      setIdeas(
        data.ideas ?? [],
      );

      setAnalyzedVideos(
        data.analyzedVideos ?? 0,
      );

      setIntelligence(
        data.intelligence ??
          null,
      );

      toast.success(
        "Ideas generated from your Instagram performance",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not generate ideas",
      );
    } finally {
      setGenerating(false);
    }
  }

  function clearIdeas() {
    setIdeas([]);

    setAnalyzedVideos(0);

    setIntelligence(null);

    toast.success(
      "Ideas cleared",
    );
  }

  return (
    <AppShell>
      <div className="space-y-7">
        <div>
          <div className="flex items-center gap-2">
            <Brain
              size={17}
              className="text-emerald-400"
            />

            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/70">
              Content Intelligence
            </p>
          </div>

          <h1 className="mt-2 text-4xl font-bold text-white">
            AI Ideas
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Generate new video ideas
            based on the performance
            patterns across your synced
            Instagram content.
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-emerald-400/20
            bg-white/[0.04]
            p-6
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-emerald-400/30
                bg-emerald-400/10
              "
            >
              <WandSparkles
                size={21}
                className="text-emerald-400"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white">
                What should you post
                next?
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                CreatorOS will analyze
                your views, likes,
                comments, shares, saves,
                captions, hashtags,
                topics and content
                patterns before
                generating ideas.
              </p>

              <form
                onSubmit={
                  generateIdeas
                }
                className="mt-5"
              >
                <textarea
                  value={request}
                  onChange={(event) =>
                    setRequest(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Optional: Tell the AI what kind of ideas you want. Example: Give me 6 trading psychology Reel ideas, or leave this blank and let CreatorOS decide based on my account."
                  rows={4}
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-emerald-400/20
                    bg-black/30
                    px-4
                    py-3
                    text-sm
                    leading-6
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-600
                    focus:border-emerald-400/50
                  "
                />

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-xs text-zinc-500">
                    Leaving the prompt
                    blank generates ideas
                    purely from your
                    account performance.
                  </p>

                  <div className="flex items-center gap-3">
                    {ideas.length >
                      0 && (
                      <button
                        type="button"
                        onClick={
                          clearIdeas
                        }
                        disabled={
                          generating
                        }
                        className="
                          flex
                          shrink-0
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-red-400/20
                          bg-red-400/[0.05]
                          px-4
                          py-2.5
                          text-sm
                          font-semibold
                          text-red-300
                          transition
                          hover:border-red-400/40
                          hover:bg-red-400/10
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        <Trash2
                          size={16}
                        />

                        Clear Ideas
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={
                        generating
                      }
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        bg-emerald-400
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-black
                        transition
                        hover:bg-emerald-300
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {generating ? (
                        <>
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />

                          Analyzing
                          Account...
                        </>
                      ) : (
                        <>
                          <Sparkles
                            size={17}
                          />

                          Generate
                          Ideas
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {needsInstagramConnection && (
          <div
            className="
              rounded-2xl
              border
              border-emerald-400/20
              bg-emerald-400/[0.04]
              p-6
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-400/30
                  bg-emerald-400/10
                "
              >
                <Link2
                  size={20}
                  className="text-emerald-400"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">
                  Connect Instagram to
                  generate ideas
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
                  CreatorOS generates
                  ideas from your real
                  Instagram performance.
                  Connect your account
                  first, sync your
                  content, then come
                  back here to generate
                  recommendations.
                </p>

                <Link
                  href="/settings"
                  className="
                    mt-4
                    inline-flex
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
                  <Link2
                    size={16}
                  />

                  Connect Instagram
                </Link>
              </div>
            </div>
          </div>
        )}

        {!generating &&
          !needsInstagramConnection &&
          ideas.length === 0 && (
            <div
              className="
                rounded-2xl
                border
                border-emerald-400/15
                bg-white/[0.025]
                p-10
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-emerald-400/20
                  bg-emerald-400/10
                "
              >
                <Lightbulb
                  size={23}
                  className="text-emerald-400"
                />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-white">
                Your next ideas will
                appear here
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                CreatorOS will use your
                existing Instagram
                performance instead of
                generating generic
                content suggestions.
              </p>
            </div>
          )}

        {generating && (
          <div
            className="
              rounded-2xl
              border
              border-emerald-400/20
              bg-emerald-400/[0.03]
              p-8
            "
          >
            <div className="flex items-center justify-center gap-3">
              <Loader2
                size={21}
                className="animate-spin text-emerald-400"
              />

              <div>
                <p className="font-medium text-white">
                  Analyzing your
                  content history
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Comparing
                  performance,
                  engagement,
                  captions, hashtags
                  and content
                  patterns.
                </p>
              </div>
            </div>
          </div>
        )}

        {!generating &&
          ideas.length > 0 && (
            <>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">
                    AI Recommendations
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Your Next Videos
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">
                      Account data
                      analyzed
                    </p>

                    <p className="mt-1 text-sm font-semibold text-emerald-300">
                      {analyzedVideos}{" "}
                      videos
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      clearIdeas
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-red-400/20
                      bg-red-400/[0.05]
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-red-300
                      transition
                      hover:border-red-400/40
                      hover:bg-red-400/10
                    "
                  >
                    <Trash2
                      size={14}
                    />

                    Clear
                  </button>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                {ideas.map(
                  (
                    idea,
                    index,
                  ) => (
                    <div
                      key={`${idea.title}-${index}`}
                      className="
                        rounded-2xl
                        border
                        border-emerald-400/20
                        bg-white/[0.04]
                        p-5
                        transition
                        hover:border-emerald-400/40
                      "
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-emerald-400/30
                            bg-emerald-400/10
                            text-sm
                            font-bold
                            text-emerald-400
                          "
                        >
                          {index + 1}
                        </div>

                        <span
                          className="
                            rounded-lg
                            border
                            border-emerald-400/20
                            bg-emerald-400/5
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            text-emerald-300
                          "
                        >
                          {
                            idea.content_type
                          }
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold leading-6 text-white">
                        {
                          idea.title
                        }
                      </h3>

                      <div className="mt-5 space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <TrendingUp
                              size={14}
                              className="text-emerald-400"
                            />

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                              Hook
                            </p>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-zinc-200">
                            “
                            {
                              idea.hook
                            }
                            ”
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Lightbulb
                              size={14}
                              className="text-emerald-400"
                            />

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                              Concept
                            </p>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-zinc-400">
                            {
                              idea.concept
                            }
                          </p>
                        </div>

                        <div
                          className="
                            rounded-xl
                            border
                            border-emerald-400/10
                            bg-black/20
                            p-3
                          "
                        >
                          <div className="flex items-center gap-2">
                            <Target
                              size={13}
                              className="text-emerald-400"
                            />

                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                              Why this
                              fits your
                              account
                            </p>
                          </div>

                          <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                            {
                              idea.why_it_should_work
                            }
                          </p>
                        </div>

                        {idea
                          .suggested_hashtags
                          .length >
                          0 && (
                          <div>
                            <div className="flex items-center gap-2">
                              <Hash
                                size={14}
                                className="text-emerald-400"
                              />

                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Suggested
                                Hashtags
                              </p>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {idea.suggested_hashtags.map(
                                (
                                  hashtag,
                                ) => (
                                  <span
                                    key={
                                      hashtag
                                    }
                                    className="
                                      rounded-lg
                                      border
                                      border-emerald-400/15
                                      bg-emerald-400/5
                                      px-2.5
                                      py-1
                                      text-xs
                                      text-emerald-300
                                    "
                                  >
                                    {hashtag.startsWith(
                                      "#",
                                    )
                                      ? hashtag
                                      : `#${hashtag}`}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>

              {intelligence && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-emerald-400/25
                    bg-white/[0.035]
                    p-5
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-emerald-400/25
                        bg-emerald-400/10
                      "
                    >
                      <Brain
                        size={18}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">
                        Account
                        Intelligence
                      </p>

                      <h2 className="mt-0.5 text-xl font-bold text-white">
                        What
                        CreatorOS
                        Learned From
                        Your Content
                      </h2>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-emerald-400/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2">
                        <Eye
                          size={15}
                          className="text-emerald-400"
                        />

                        <p className="text-xs text-zinc-500">
                          Average Views
                        </p>
                      </div>

                      <p className="mt-3 text-2xl font-bold text-emerald-300">
                        {formatNumber(
                          intelligence.averageViews,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        Across{" "}
                        {
                          analyzedVideos
                        }{" "}
                        videos
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-400/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp
                          size={15}
                          className="text-emerald-400"
                        />

                        <p className="text-xs text-zinc-500">
                          Engagement Rate
                        </p>
                      </div>

                      <p className="mt-3 text-2xl font-bold text-emerald-300">
                        {formatPercent(
                          intelligence.engagementRate,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        Likes, comments &
                        shares
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-400/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2">
                        <Bookmark
                          size={15}
                          className="text-emerald-400"
                        />

                        <p className="text-xs text-zinc-500">
                          Save Rate
                        </p>
                      </div>

                      <p className="mt-3 text-2xl font-bold text-emerald-300">
                        {formatPercent(
                          intelligence.saveRate,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        Saves per total
                        views
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-400/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2">
                        <Share2
                          size={15}
                          className="text-emerald-400"
                        />

                        <p className="text-xs text-zinc-500">
                          Share Rate
                        </p>
                      </div>

                      <p className="mt-3 text-2xl font-bold text-emerald-300">
                        {formatPercent(
                          intelligence.shareRate,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        Shares per total
                        views
                      </p>
                    </div>
                  </div>

                  {intelligence.topVideo && (
                    <div className="mt-3 grid gap-3 xl:grid-cols-[1.25fr_0.75fr]">
                      <div className="rounded-xl border border-emerald-400/10 bg-black/20 p-4">
                        <div className="flex items-center gap-2">
                          <Medal
                            size={15}
                            className="text-emerald-400"
                          />

                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                            Top Performing
                            Video
                          </p>
                        </div>

                        <p className="mt-3 text-base font-semibold leading-6 text-white">
                          “
                          {
                            intelligence
                              .topVideo
                              .title
                          }
                          ”
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
                          <span>
                            {formatNumber(
                              intelligence
                                .topVideo
                                .views,
                            )}{" "}
                            views
                          </span>

                          {typeof intelligence
                            .topVideo
                            .performanceScore ===
                            "number" && (
                            <span>
                              Score{" "}
                              {intelligence.topVideo.performanceScore.toFixed(
                                2,
                              )}
                            </span>
                          )}

                          {formatDate(
                            intelligence
                              .topVideo
                              .datePosted,
                          ) && (
                            <span>
                              {formatDate(
                                intelligence
                                  .topVideo
                                  .datePosted,
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4">
                        <div className="flex items-center gap-2">
                          <BarChart3
                            size={15}
                            className="text-emerald-400"
                          />

                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                            Snapshot
                          </p>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-zinc-400">
                          CreatorOS
                          evaluated{" "}
                          <span className="font-semibold text-zinc-200">
                            {
                              analyzedVideos
                            }{" "}
                            videos
                          </span>{" "}
                          before generating
                          these
                          recommendations.
                          The metrics above
                          are calculated
                          from your synced
                          Instagram
                          performance.
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300">
                          <MousePointer2
                            size={13}
                          />

                          Real account data
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={
                    clearIdeas
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-400/[0.05]
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-red-300
                    transition
                    hover:border-red-400/40
                    hover:bg-red-400/10
                  "
                >
                  <Trash2
                    size={16}
                  />

                  Clear Ideas
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void generateIdeas()
                  }
                  disabled={
                    generating
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-emerald-400/30
                    bg-emerald-400/10
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-emerald-300
                    transition
                    hover:bg-emerald-400/15
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <Sparkles
                    size={17}
                  />

                  Generate More
                  Ideas
                </button>
              </div>
            </>
          )}
      </div>
    </AppShell>
  );
}