"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BarChart3,
  Bookmark,
  Brain,
  Eye,
  Loader2,
  RefreshCw,
  Send,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getVideos,
  type Video,
} from "@/lib/analytics";

const suggestedQuestions = [
  {
    icon: TrendingUp,
    text: "Why did my recent posts underperform?",
  },
  {
    icon: Bookmark,
    text: "What content gets the most saves?",
  },
  {
    icon: Target,
    text: "What are my strongest topics?",
  },
  {
    icon: BarChart3,
    text: "Compare my last 5 posts",
  },
  {
    icon: Sparkles,
    text: "What should I improve?",
  },
];

function safeNumber(value: unknown) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

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

export default function AICoachPage() {
  const [videos, setVideos] =
    useState<Video[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [question, setQuestion] =
    useState("");

  const [
    submittedQuestion,
    setSubmittedQuestion,
  ] = useState("");

  async function loadVideos() {
    setLoading(true);

    try {
      const data =
        await getVideos();

      setVideos(
        data ?? [],
      );
    } catch (error) {
      console.error(
        "AI ASSISTANT VIDEO LOAD ERROR:",
        error,
      );

      setVideos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVideos();
  }, []);

  const snapshot = useMemo(() => {
    if (
      videos.length === 0
    ) {
      return {
        averageViews: 0,
        engagementRate: 0,
        saveRate: 0,
        shareRate: 0,
      };
    }

    const totals =
      videos.reduce(
        (
          accumulator,
          video,
        ) => {
          accumulator.views +=
            safeNumber(
              video.views,
            );

          accumulator.likes +=
            safeNumber(
              video.likes,
            );

          accumulator.comments +=
            safeNumber(
              video.comments,
            );

          accumulator.shares +=
            safeNumber(
              video.shares,
            );

          accumulator.saves +=
            safeNumber(
              video.saves,
            );

          return accumulator;
        },
        {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          saves: 0,
        },
      );

    const averageViews =
      totals.views /
      videos.length;

    const engagementRate =
      totals.views > 0
        ? ((
            totals.likes +
            totals.comments +
            totals.shares
          ) /
            totals.views) *
          100
        : 0;

    const saveRate =
      totals.views > 0
        ? (totals.saves /
            totals.views) *
          100
        : 0;

    const shareRate =
      totals.views > 0
        ? (totals.shares /
            totals.views) *
          100
        : 0;

    return {
      averageViews,
      engagementRate,
      saveRate,
      shareRate,
    };
  }, [videos]);

  function askQuestion(
    event?: FormEvent<HTMLFormElement>,
  ) {
    event?.preventDefault();

    const trimmed =
      question.trim();

    if (!trimmed) {
      return;
    }

    setSubmittedQuestion(
      trimmed,
    );

    /*
      We will connect this to
      OpenRouter in the next step.
    */
  }

  function chooseQuestion(
    value: string,
  ) {
    setQuestion(value);
  }

  return (
    <AppShell>
      <div className="space-y-7">
        {/* Header */}

        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Brain
                size={17}
                className="text-emerald-400"
              />

              <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/70">
                AI Assistant
              </p>
            </div>

            <h1 className="mt-2 text-4xl font-bold text-white">
              AI Assistant
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Ask CreatorOS anything
              about your Instagram
              performance. Get clear
              answers based on your
              real account data.
            </p>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() =>
                void loadVideos()
              }
              disabled={loading}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-emerald-400/20
                bg-white/[0.03]
                px-3.5
                py-2.5
                text-xs
                font-medium
                text-zinc-300
                transition
                hover:border-emerald-400/40
                hover:bg-emerald-400/[0.05]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin text-emerald-400"
                    : "text-emerald-400"
                }
              />

              Refresh Data
            </button>

            <p className="mt-3 text-xs text-zinc-500">
              Account data analyzed
            </p>

            <p className="mt-1 text-sm font-semibold text-emerald-300">
              {loading
                ? "Loading..."
                : `${videos.length} videos`}
            </p>
          </div>
        </div>

        {/* Main Layout */}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-5">
            {/* Ask CreatorOS */}

            <div
              className="
                rounded-2xl
                border
                border-emerald-400/15
                bg-white/[0.035]
                p-5
              "
            >
              <p className="text-sm font-medium text-white">
                Ask CreatorOS about
                your content
              </p>

              <form
                onSubmit={
                  askQuestion
                }
                className="mt-4 flex gap-3"
              >
                <input
                  value={question}
                  onChange={(event) =>
                    setQuestion(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Ask CreatorOS anything..."
                  className="
                    min-w-0
                    flex-1
                    rounded-xl
                    border
                    border-white/10
                    bg-black/30
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-600
                    focus:border-emerald-400/40
                  "
                />

                <button
                  type="submit"
                  disabled={
                    !question.trim()
                  }
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-emerald-400/30
                    bg-emerald-400/15
                    text-emerald-300
                    transition
                    hover:bg-emerald-400/25
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <Send
                    size={18}
                  />
                </button>
              </form>

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
                Suggested Questions
              </p>

              <div className="mt-3 grid gap-2 md:grid-cols-5">
                {suggestedQuestions.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    return (
                      <button
                        key={
                          item.text
                        }
                        type="button"
                        onClick={() =>
                          chooseQuestion(
                            item.text,
                          )
                        }
                        className="
                          rounded-xl
                          border
                          border-white/10
                          bg-black/20
                          p-3
                          text-left
                          transition
                          hover:border-emerald-400/30
                          hover:bg-emerald-400/[0.04]
                        "
                      >
                        <Icon
                          size={15}
                          className="text-emerald-400"
                        />

                        <p className="mt-2 text-xs leading-5 text-zinc-300">
                          {
                            item.text
                          }
                        </p>
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* Conversation */}

            <div
              className="
                min-h-[360px]
                rounded-2xl
                border
                border-emerald-400/15
                bg-white/[0.025]
              "
            >
              {!submittedQuestion ? (
                <div className="flex min-h-[360px] items-center justify-center p-8 text-center">
                  <div className="max-w-md">
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
                      <Brain
                        size={22}
                        className="text-emerald-400"
                      />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-white">
                      Understand your
                      content
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Ask a question
                      about your posts,
                      performance,
                      topics, hooks or
                      recent trends.
                      CreatorOS will use
                      your synced
                      Instagram data to
                      help explain what
                      is happening.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="border-b border-white/[0.06] p-5">
                    <p className="text-xs font-medium text-zinc-500">
                      You
                    </p>

                    <p className="mt-2 text-sm text-zinc-200">
                      {
                        submittedQuestion
                      }
                    </p>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start gap-3">
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
                          border-emerald-400/25
                          bg-emerald-400/10
                        "
                      >
                        <Brain
                          size={17}
                          className="text-emerald-400"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          CreatorOS
                        </p>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                          Your AI
                          analysis will
                          appear here.
                          In the next
                          step we’ll
                          connect this
                          chat to your
                          real Instagram
                          data through
                          OpenRouter.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Snapshot */}

          <div className="space-y-4">
            <div
              className="
                rounded-2xl
                border
                border-emerald-400/15
                bg-white/[0.035]
                p-4
              "
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Account Snapshot
              </p>

              {loading ? (
                <div className="flex items-center gap-2 py-8 text-sm text-zinc-500">
                  <Loader2
                    size={16}
                    className="animate-spin text-emerald-400"
                  />

                  Loading account...
                </div>
              ) : (
                <div className="mt-4 space-y-5">
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
                        border-emerald-400/15
                        bg-black/20
                      "
                    >
                      <Eye
                        size={16}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>
                      <p className="text-lg font-bold text-emerald-300">
                        {formatNumber(
                          snapshot.averageViews,
                        )}
                      </p>

                      <p className="text-xs text-zinc-500">
                        Avg Views
                      </p>
                    </div>
                  </div>

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
                        border-emerald-400/15
                        bg-black/20
                      "
                    >
                      <TrendingUp
                        size={16}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>
                      <p className="text-lg font-bold text-emerald-300">
                        {formatPercent(
                          snapshot.engagementRate,
                        )}
                      </p>

                      <p className="text-xs text-zinc-500">
                        Engagement Rate
                      </p>
                    </div>
                  </div>

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
                        border-emerald-400/15
                        bg-black/20
                      "
                    >
                      <Bookmark
                        size={16}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>
                      <p className="text-lg font-bold text-emerald-300">
                        {formatPercent(
                          snapshot.saveRate,
                        )}
                      </p>

                      <p className="text-xs text-zinc-500">
                        Save Rate
                      </p>
                    </div>
                  </div>

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
                        border-emerald-400/15
                        bg-black/20
                      "
                    >
                      <Share2
                        size={16}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>
                      <p className="text-lg font-bold text-emerald-300">
                        {formatPercent(
                          snapshot.shareRate,
                        )}
                      </p>

                      <p className="text-xs text-zinc-500">
                        Share Rate
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="
                rounded-2xl
                border
                border-emerald-400/10
                bg-emerald-400/[0.025]
                p-4
              "
            >
              <div className="flex items-center gap-2">
                <Brain
                  size={14}
                  className="text-emerald-400"
                />

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  What this page is for
                </p>
              </div>

              <p className="mt-3 text-xs leading-5 text-zinc-500">
                Use the AI Assistant
                to understand why your
                content is performing
                the way it is, compare
                posts and periods, and
                make better decisions.
              </p>

              <p className="mt-3 text-xs leading-5 text-zinc-600">
                For new content
                concepts, use the
                Ideas page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}