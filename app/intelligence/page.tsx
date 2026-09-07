"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  BarChart3,
  Bookmark,
  Brain,
  CheckCircle2,
  Eye,
  Loader2,
  RefreshCw,
  Send,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Video as VideoIcon,
} from "lucide-react";

import { toast } from "sonner";

import AppShell from "@/components/layout/AppShell";

import { supabase } from "@/lib/supabase";

import {
  getVideos,
  type Video,
} from "@/lib/analytics";

type Metric = {
  label: string;
  value: string;
  context: string;
};

type Insight = {
  title: string;
  detail: string;
  evidence: string;
};

type Analysis = {
  headline: string;
  summary: string;
  metrics: Metric[];
  insights: Insight[];
  next_moves: string[];
  confidence: "high" | "medium" | "low";
};

type AssistantResponse = {
  analysis?: Analysis;
  analyzedVideos?: number;
  model?: string;
  error?: string;
};

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


const loadingStages = [
  {
    min: 0,
    max: 14,
    label: "Preparing your request",
    detail:
      "Getting the AI Assistant ready for your question.",
  },
  {
    min: 15,
    max: 31,
    label: "Loading account data",
    detail:
      "Gathering the Instagram performance data tied to your CreatorOS account.",
  },
  {
    min: 32,
    max: 52,
    label: "Analyzing your content",
    detail:
      "Comparing views, engagement, saves, shares, and recent performance.",
  },
  {
    min: 53,
    max: 69,
    label: "Identifying patterns",
    detail:
      "Looking for repeated signals across your strongest and weakest posts.",
  },
  {
    min: 70,
    max: 84,
    label: "Thinking through the answer",
    detail:
      "Turning the strongest evidence into a useful explanation.",
  },
  {
    min: 85,
    max: 98,
    label: "Generating response",
    detail:
      "Writing a concise answer based on your real account data.",
  },
  {
    min: 99,
    max: 100,
    label: "Finalizing response",
    detail:
      "Finishing the analysis and preparing it for display.",
  },
];

function getLoadingStage(progress: number) {
  return (
    loadingStages.find(
      (stage) =>
        progress >= stage.min &&
        progress <= stage.max,
    ) ?? loadingStages[loadingStages.length - 1]
  );
}

function safeNumber(value: unknown) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(Math.round(value));
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function IntelligencePage() {
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

  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);

  const [asking, setAsking] =
    useState(false);

  const [
    responseProgress,
    setResponseProgress,
  ] = useState(0);

  const progressIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    );

  const [
    analyzedVideos,
    setAnalyzedVideos,
  ] = useState(0);

  async function loadVideos() {
    setLoading(true);

    try {
      const data =
        await getVideos();

      setVideos(data ?? []);
    } catch (error) {
      console.error(
        "AI ASSISTANT VIDEO LOAD ERROR:",
        error,
      );

      setVideos([]);

      toast.error(
        "Could not load account data",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVideos();
  }, []);

  useEffect(() => {
    if (!asking) {
      if (progressIntervalRef.current) {
        clearInterval(
          progressIntervalRef.current,
        );

        progressIntervalRef.current =
          null;
      }

      return;
    }

    if (progressIntervalRef.current) {
      clearInterval(
        progressIntervalRef.current,
      );
    }

    progressIntervalRef.current =
      setInterval(() => {
        setResponseProgress(
          (current) => {
            if (current >= 98) {
              return 98;
            }

            let increment = 1;

            if (current < 20) {
              increment =
                Math.random() < 0.45 ? 2 : 1;
            } else if (current < 55) {
              increment =
                Math.random() < 0.25 ? 2 : 1;
            } else if (current < 80) {
              increment =
                Math.random() < 0.18 ? 2 : 1;
            } else if (current < 92) {
              increment =
                Math.random() < 0.08 ? 2 : 1;
            } else {
              increment =
                Math.random() < 0.6 ? 0 : 1;
            }

            return Math.min(
              98,
              current + increment,
            );
          },
        );
      }, 700);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(
          progressIntervalRef.current,
        );

        progressIntervalRef.current =
          null;
      }
    };
  }, [asking]);

  const loadingStage =
    getLoadingStage(
      responseProgress,
    );

  const snapshot = useMemo(() => {
    const totals =
      videos.reduce(
        (accumulator, video) => {
          accumulator.views +=
            safeNumber(video.views);

          accumulator.likes +=
            safeNumber(video.likes);

          accumulator.comments +=
            safeNumber(
              video.comments,
            );

          accumulator.shares +=
            safeNumber(video.shares);

          accumulator.saves +=
            safeNumber(video.saves);

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
      videos.length > 0
        ? totals.views /
          videos.length
        : 0;

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

  async function askCreatorOS(
    value: string,
  ) {
    const trimmed =
      value.trim();

    if (!trimmed || asking) {
      return;
    }

    setSubmittedQuestion(
      trimmed,
    );

    setAnalysis(null);

    setResponseProgress(4);

    setAsking(true);

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

      setResponseProgress(
        (current) =>
          Math.max(current, 18),
      );

      const response =
        await fetch(
          "/api/ai-assistant/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${accessToken}`,
            },

            body: JSON.stringify({
              question: trimmed,
            }),
          },
        );

      setResponseProgress(
        (current) =>
          Math.max(current, 34),
      );

      const responseText =
        await response.text();

      setResponseProgress(
        (current) =>
          Math.max(current, 96),
      );

      let data: AssistantResponse = {};

      if (responseText.trim()) {
        try {
          data =
            JSON.parse(
              responseText,
            ) as AssistantResponse;
        } catch {
          const contentType =
            response.headers.get(
              "content-type",
            ) || "";

          console.error(
            "AI ASSISTANT NON-JSON RESPONSE:",
            {
              status:
                response.status,
              statusText:
                response.statusText,
              contentType,
              responseText,
            },
          );

          throw new Error(
            response.ok
              ? "CreatorOS returned an invalid server response."
              : `AI Assistant request failed (${response.status}). Check the terminal or deployment logs for the server error.`,
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Could not analyze your account (${response.status})`,
        );
      }

      if (!data.analysis) {
        throw new Error(
          "CreatorOS returned an empty analysis",
        );
      }

      setResponseProgress(100);

      setAnalysis(
        data.analysis,
      );

      setAnalyzedVideos(
        data.analyzedVideos ??
          videos.length,
      );
    } catch (error) {
      console.error(
        "AI ASSISTANT QUESTION ERROR:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : "Could not analyze your account";

      toast.error(message);

      setAnalysis(null);
    } finally {
      await new Promise(
        (resolve) =>
          window.setTimeout(
            resolve,
            280,
          ),
      );

      setAsking(false);
    }
  }

  function submitQuestion(
    event?: FormEvent<HTMLFormElement>,
  ) {
    event?.preventDefault();

    void askCreatorOS(
      question,
    );
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
              Ask CreatorOS questions
              about your Instagram
              performance and get
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
              disabled={
                loading ||
                asking
              }
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
              Account data available
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
            {/* Ask */}

            <div className="rounded-2xl border border-emerald-400/15 bg-white/[0.035] p-5">
              <p className="text-sm font-medium text-white">
                Ask CreatorOS about
                your content
              </p>

              <form
                onSubmit={
                  submitQuestion
                }
                className="mt-4 flex gap-3"
              >
                <input
                  value={question}
                  onChange={(event) =>
                    setQuestion(
                      event.target.value,
                    )
                  }
                  placeholder="Ask CreatorOS anything..."
                  disabled={asking}
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
                    disabled:opacity-60
                  "
                />

                <button
                  type="submit"
                  disabled={
                    !question.trim() ||
                    asking
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
                    disabled:opacity-40
                  "
                >
                  {asking ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
                Suggested Questions
              </p>

              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
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
                        disabled={
                          asking
                        }
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
                          disabled:opacity-50
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

            {/* Response */}

            <div className="min-h-[380px] overflow-hidden rounded-2xl border border-emerald-400/15 bg-white/[0.025]">
              {!submittedQuestion ? (
                <div className="flex min-h-[380px] items-center justify-center p-8 text-center">
                  <div className="max-w-md">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
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
                      Ask about recent
                      performance,
                      individual posts,
                      topics, hooks,
                      saves, shares or
                      changes across
                      your account.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {/* User */}

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

                  {/* CreatorOS */}

                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10">
                        {asking ? (
                          <Loader2
                            size={17}
                            className="animate-spin text-emerald-400"
                          />
                        ) : (
                          <Brain
                            size={17}
                            className="text-emerald-400"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-medium text-white">
                            CreatorOS
                          </p>

                          {!asking &&
                            analysis && (
                              <p className="text-[11px] text-zinc-600">
                                Analyzed{" "}
                                {
                                  analyzedVideos
                                }{" "}
                                videos
                              </p>
                            )}
                        </div>

                        {asking ? (
                          <div className="mt-4 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                  </span>

                                  <p className="text-sm font-medium text-emerald-300">
                                    {loadingStage.label}
                                  </p>
                                </div>

                                <p className="mt-1.5 max-w-2xl text-xs leading-5 text-zinc-500">
                                  {loadingStage.detail}
                                </p>
                              </div>

                              <div className="shrink-0 text-right">
                                <p className="text-2xl font-bold tabular-nums text-emerald-300">
                                  {responseProgress}%
                                </p>

                                <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                                  Progress
                                </p>
                              </div>
                            </div>

                            <div>
                              <div className="h-2.5 overflow-hidden rounded-full border border-emerald-400/15 bg-black/40">
                                <div
                                  className="relative h-full rounded-full bg-emerald-400 transition-[width] duration-700 ease-out"
                                  style={{
                                    width: `${responseProgress}%`,
                                  }}
                                >
                                  <div className="absolute inset-0 animate-pulse bg-white/15" />
                                </div>
                              </div>

                              <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-600">
                                <span>
                                  CreatorOS is working through your account data
                                </span>

                                <span>
                                  {responseProgress < 99
                                    ? "Please keep this page open"
                                    : "Almost done"}
                                </span>
                              </div>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-3">
                              {[
                                {
                                  label: "Account data",
                                  done:
                                    responseProgress >= 18,
                                },
                                {
                                  label: "Content analysis",
                                  done:
                                    responseProgress >= 55,
                                },
                                {
                                  label: "AI response",
                                  done:
                                    responseProgress >= 99,
                                },
                              ].map((step) => (
                                <div
                                  key={step.label}
                                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] transition ${
                                    step.done
                                      ? "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-300"
                                      : "border-white/[0.06] bg-black/20 text-zinc-600"
                                  }`}
                                >
                                  {step.done ? (
                                    <CheckCircle2
                                      size={13}
                                      className="text-emerald-400"
                                    />
                                  ) : (
                                    <Loader2
                                      size={13}
                                      className="animate-spin text-zinc-600"
                                    />
                                  )}

                                  {step.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : analysis ? (
                          <div className="mt-4 space-y-5">
                            {/* Headline */}

                            <div>
                              <h2 className="text-xl font-semibold text-white">
                                {
                                  analysis.headline
                                }
                              </h2>

                              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                                {
                                  analysis.summary
                                }
                              </p>
                            </div>

                            {/* Metrics */}

                            {analysis.metrics?.length >
                              0 && (
                              <div className="grid gap-3 md:grid-cols-3">
                                {analysis.metrics.map(
                                  (
                                    metric,
                                    index,
                                  ) => (
                                    <div
                                      key={`${metric.label}-${index}`}
                                      className="rounded-xl border border-emerald-400/10 bg-black/20 p-4"
                                    >
                                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                        {
                                          metric.label
                                        }
                                      </p>

                                      <p className="mt-2 text-2xl font-bold text-emerald-300">
                                        {
                                          metric.value
                                        }
                                      </p>

                                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                                        {
                                          metric.context
                                        }
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}

                            {/* Insights */}

                            {analysis.insights?.length >
                              0 && (
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                                  Key Insights
                                </p>

                                <div className="mt-3 space-y-3">
                                  {analysis.insights.map(
                                    (
                                      insight,
                                      index,
                                    ) => (
                                      <div
                                        key={`${insight.title}-${index}`}
                                        className="rounded-xl border border-white/[0.07] bg-black/20 p-4"
                                      >
                                        <p className="text-sm font-semibold text-white">
                                          {
                                            insight.title
                                          }
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                                          {
                                            insight.detail
                                          }
                                        </p>

                                        <div className="mt-3 rounded-lg border border-emerald-400/10 bg-emerald-400/[0.03] px-3 py-2">
                                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400/70">
                                            Evidence
                                          </p>

                                          <p className="mt-1 text-xs leading-5 text-zinc-500">
                                            {
                                              insight.evidence
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Next Moves */}

                            {analysis.next_moves?.length >
                              0 && (
                              <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.03] p-4">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2
                                    size={15}
                                    className="text-emerald-400"
                                  />

                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                    What I’d Focus On
                                  </p>
                                </div>

                                <div className="mt-3 space-y-2">
                                  {analysis.next_moves.map(
                                    (
                                      move,
                                      index,
                                    ) => (
                                      <div
                                        key={`${move}-${index}`}
                                        className="flex gap-2"
                                      >
                                        <span className="text-sm font-semibold text-emerald-400">
                                          {index +
                                            1}
                                          .
                                        </span>

                                        <p className="text-sm leading-6 text-zinc-400">
                                          {
                                            move
                                          }
                                        </p>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-zinc-500">
                            No analysis
                            was returned.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Purpose */}

            <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.02] px-4 py-3">
              <div className="flex items-center gap-2">
                <Brain
                  size={13}
                  className="text-emerald-400"
                />

                <p className="text-xs text-zinc-500">
                  AI Assistant is for
                  understanding your
                  account and making
                  decisions. For new
                  video concepts, use
                  AI Ideas.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}

          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-400/15 bg-white/[0.035] p-4">
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/15 bg-black/20">
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/15 bg-black/20">
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/15 bg-black/20">
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/15 bg-black/20">
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

            {/* Quick Analysis */}

            <div className="rounded-2xl border border-emerald-400/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Quick Analysis
              </p>

              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  disabled={asking}
                  onClick={() =>
                    setQuestion(
                      "Analyze one of my recent videos and tell me what worked and what could improve.",
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-black/20
                    px-3
                    py-3
                    text-left
                    text-xs
                    text-zinc-400
                    transition
                    hover:border-emerald-400/25
                    hover:text-zinc-200
                    disabled:opacity-50
                  "
                >
                  <VideoIcon
                    size={14}
                    className="text-emerald-400"
                  />

                  Analyze a video
                </button>

                <button
                  type="button"
                  disabled={asking}
                  onClick={() =>
                    setQuestion(
                      "Compare my recent performance to my older posts and tell me what changed.",
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-black/20
                    px-3
                    py-3
                    text-left
                    text-xs
                    text-zinc-400
                    transition
                    hover:border-emerald-400/25
                    hover:text-zinc-200
                    disabled:opacity-50
                  "
                >
                  <BarChart3
                    size={14}
                    className="text-emerald-400"
                  />

                  Compare performance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}