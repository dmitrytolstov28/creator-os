"use client";

import { Calendar, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm text-zinc-400">{greeting},</p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
          Dmitry 👋
        </h1>

        <p className="mt-3 text-zinc-500">
          {today} • Let's make something viral.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/videos"
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500"
        >
          <Plus size={18} />
          Add Video
        </Link>

        <Link
          href="/calendar"
          className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-white transition hover:border-violet-500"
        >
          <Calendar size={18} />
          Calendar
        </Link>

        <Link
          href="/analytics"
          className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-white transition hover:border-violet-500"
        >
          <TrendingUp size={18} />
          Analytics
        </Link>
      </div>
    </div>
  );
}