"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Camera,
  Loader2,
  Video,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabase";

type CalendarVideo = {
  id: number;
  title: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
  date_posted: string | null;
  thumbnail_url: string | null;
  post_url: string | null;
};

const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function dateKey(
  year: number,
  month: number,
  day: number,
) {
  const monthString =
    String(month + 1).padStart(
      2,
      "0",
    );

  const dayString =
    String(day).padStart(
      2,
      "0",
    );

  return `${year}-${monthString}-${dayString}`;
}

function normalizeDateKey(
  value: string,
) {
  return value.slice(0, 10);
}

export default function CalendarPage() {
  const today = new Date();

  const [year, setYear] =
    useState(
      today.getFullYear(),
    );

  const [month, setMonth] =
    useState(
      today.getMonth(),
    );

  const [videos, setVideos] =
    useState<CalendarVideo[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("videos")
        .select(
          `
            id,
            title,
            platform,
            views,
            likes,
            comments,
            date_posted,
            thumbnail_url,
            post_url
          `,
        )
        .not(
          "date_posted",
          "is",
          null,
        )
        .order(
          "date_posted",
          {
            ascending: true,
          },
        );

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setVideos(
        (data ?? []) as CalendarVideo[],
      );

      setLoading(false);
    }

    void loadVideos();
  }, []);

  const videosByDate =
    useMemo(() => {
      const grouped: Record<
        string,
        CalendarVideo[]
      > = {};

      videos.forEach(
        (video) => {
          if (!video.date_posted) {
            return;
          }

          const key =
            normalizeDateKey(
              video.date_posted,
            );

          if (!grouped[key]) {
            grouped[key] = [];
          }

          grouped[key].push(
            video,
          );
        },
      );

      return grouped;
    }, [videos]);

  const calendarDays =
    useMemo(() => {
      const firstDay =
        new Date(
          year,
          month,
          1,
        ).getDay();

      const daysInMonth =
        new Date(
          year,
          month + 1,
          0,
        ).getDate();

      const previousMonthDays =
        new Date(
          year,
          month,
          0,
        ).getDate();

      const cells: {
        day: number;
        currentMonth: boolean;
        key: string;
      }[] = [];

      for (
        let index =
          firstDay - 1;
        index >= 0;
        index--
      ) {
        const day =
          previousMonthDays -
          index;

        const previous =
          new Date(
            year,
            month - 1,
            day,
          );

        cells.push({
          day,
          currentMonth: false,
          key: dateKey(
            previous.getFullYear(),
            previous.getMonth(),
            day,
          ),
        });
      }

      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {
        cells.push({
          day,
          currentMonth: true,
          key: dateKey(
            year,
            month,
            day,
          ),
        });
      }

      let nextDay = 1;

      while (
        cells.length % 7 !== 0
      ) {
        const next =
          new Date(
            year,
            month + 1,
            nextDay,
          );

        cells.push({
          day: nextDay,
          currentMonth: false,
          key: dateKey(
            next.getFullYear(),
            next.getMonth(),
            nextDay,
          ),
        });

        nextDay++;
      }

      return cells;
    }, [year, month]);

  const monthVideos =
    videos.filter(
      (video) => {
        if (!video.date_posted) {
          return false;
        }

        const key =
          normalizeDateKey(
            video.date_posted,
          );

        return key.startsWith(
          `${year}-${String(
            month + 1,
          ).padStart(2, "0")}`,
        );
      },
    );

  const monthViews =
    monthVideos.reduce(
      (
        total,
        video,
      ) =>
        total +
        (video.views ?? 0),
      0,
    );

  function previousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(
        (current) =>
          current - 1,
      );

      return;
    }

    setMonth(
      (current) =>
        current - 1,
    );
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(
        (current) =>
          current + 1,
      );

      return;
    }

    setMonth(
      (current) =>
        current + 1,
    );
  }

  function goToToday() {
    const current =
      new Date();

    setYear(
      current.getFullYear(),
    );

    setMonth(
      current.getMonth(),
    );
  }

  const todayKey =
    dateKey(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

  return (
    <AppShell>
      <div className="space-y-7">
        {/* Header */}

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays
                size={17}
                className="text-emerald-400"
              />

              <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/70">
                Content History
              </p>
            </div>

            <h1 className="mt-2 text-4xl font-bold text-white">
              Content Calendar
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              See exactly when your Instagram content was published.
            </p>
          </div>

          <button
            type="button"
            onClick={goToToday}
            className="
              rounded-xl
              border
              border-emerald-400/20
              bg-white/[0.04]
              px-4
              py-2.5
              text-sm
              font-medium
              text-zinc-300
              transition
              hover:border-emerald-400/40
              hover:text-white
            "
          >
            Today
          </button>
        </div>

        {/* Summary */}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-4">
            <Video
              size={19}
              className="text-emerald-400"
            />

            <p className="mt-2 text-sm text-zinc-400">
              Posts This Month
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {monthVideos.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-4">
            <Eye
              size={19}
              className="text-emerald-400"
            />

            <p className="mt-2 text-sm text-zinc-400">
              Views This Month
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {monthViews.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-4">
            <Camera
              size={19}
              className="text-emerald-400"
            />

            <p className="mt-2 text-sm text-zinc-400">
              Published Content
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {videos.length}
            </p>
          </div>
        </div>

        {/* Calendar */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-emerald-400/20
            bg-white/[0.03]
            backdrop-blur-xl
          "
        >
          {/* Calendar Header */}

          <div className="flex items-center justify-between border-b border-emerald-400/10 px-5 py-4">
            <div>
              <p className="text-lg font-semibold text-white">
                {monthNames[month]}{" "}
                {year}
              </p>

              <p className="mt-0.5 text-xs text-zinc-500">
                Instagram publishing history
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={
                  previousMonth
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-400/20
                  bg-white/[0.04]
                  text-zinc-400
                  transition
                  hover:text-white
                "
              >
                <ChevronLeft
                  size={18}
                />
              </button>

              <button
                type="button"
                onClick={
                  nextMonth
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-400/20
                  bg-white/[0.04]
                  text-zinc-400
                  transition
                  hover:text-white
                "
              >
                <ChevronRight
                  size={18}
                />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[500px] items-center justify-center gap-3 text-zinc-400">
              <Loader2
                size={19}
                className="animate-spin"
              />

              Loading published content...
            </div>
          ) : (
            <>
              {/* Weekdays */}

              <div className="grid grid-cols-7 border-b border-emerald-400/10">
                {weekDays.map(
                  (day) => (
                    <div
                      key={day}
                      className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              {/* Days */}

              <div className="grid grid-cols-7">
                {calendarDays.map(
                  (cell) => {
                    const dayVideos =
                      videosByDate[
                        cell.key
                      ] ?? [];

                    const isToday =
                      cell.key ===
                      todayKey;

                    return (
                      <div
                        key={
                          cell.key
                        }
                        className={`
                          min-h-[155px]
                          border-b
                          border-r
                          border-emerald-400/10
                          p-2.5
                          ${
                            cell.currentMonth
                              ? "bg-transparent"
                              : "bg-black/20"
                          }
                        `}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className={`
                              flex
                              h-7
                              min-w-7
                              items-center
                              justify-center
                              rounded-lg
                              text-xs
                              font-semibold
                              ${
                                isToday
                                  ? "bg-emerald-400 text-black"
                                  : cell.currentMonth
                                    ? "text-zinc-300"
                                    : "text-zinc-700"
                              }
                            `}
                          >
                            {
                              cell.day
                            }
                          </span>

                          {dayVideos.length >
                            0 && (
                            <span className="text-[10px] font-medium text-emerald-400/70">
                              {
                                dayVideos.length
                              }{" "}
                              {dayVideos.length ===
                              1
                                ? "post"
                                : "posts"}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          {dayVideos.map(
                            (
                              video,
                            ) => (
                              <Link
                                key={
                                  video.id
                                }
                                href={`/videos/${video.id}`}
                                className="
                                  group
                                  block
                                  overflow-hidden
                                  rounded-xl
                                  border
                                  border-emerald-400/15
                                  bg-black/40
                                  transition
                                  hover:border-emerald-400/50
                                "
                              >
                                <div className="flex gap-2 p-2">
                                  {video.thumbnail_url ? (
                                    <img
                                      src={
                                        video.thumbnail_url
                                      }
                                      alt={
                                        video.title
                                      }
                                      className="
                                        h-12
                                        w-9
                                        shrink-0
                                        rounded-md
                                        object-cover
                                      "
                                    />
                                  ) : (
                                    <div
                                      className="
                                        flex
                                        h-12
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-md
                                        bg-white/5
                                      "
                                    >
                                      <Video
                                        size={
                                          14
                                        }
                                        className="text-zinc-600"
                                      />
                                    </div>
                                  )}

                                  <div className="min-w-0">
                                    <p
                                      className="
                                        line-clamp-2
                                        text-[11px]
                                        font-semibold
                                        leading-4
                                        text-zinc-200
                                        group-hover:text-white
                                      "
                                    >
                                      {
                                        video.title
                                      }
                                    </p>

                                    <div className="mt-1 flex items-center gap-1 text-[10px] text-zinc-500">
                                      <Eye
                                        size={
                                          10
                                        }
                                      />

                                      {video.views.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ),
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}