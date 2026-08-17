"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

import { Card } from "@/components/ui/card";
import { supabase } from "../../lib/supabase";

type ScheduledDraft = {
  id: string;
  title: string | null;
  scheduled_for: string | null;
};

export default function UpcomingSchedule() {
  const [drafts, setDrafts] = useState<ScheduledDraft[]>([]);

  useEffect(() => {
    async function loadSchedule() {
      const { data } = await supabase
        .from("content_drafts")
        .select("id,title,scheduled_for")
        .not("scheduled_for", "is", null)
        .order("scheduled_for", { ascending: true })
        .limit(5);

      setDrafts(data ?? []);
    }

    void loadSchedule();
  }, []);

  return (
    <Card className="border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center gap-2">
        <CalendarDays
          className="text-violet-400"
          size={18}
        />

        <h2 className="text-xl font-semibold text-white">
          Upcoming Schedule
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {drafts.length === 0 ? (
          <p className="text-zinc-500">
            No scheduled posts.
          </p>
        ) : (
          drafts.map((draft) => (
            <div
              key={draft.id}
              className="rounded-xl border border-zinc-800 bg-black/30 p-4"
            >
              <p className="font-medium text-white">
                {draft.title ?? "Untitled Draft"}
              </p>

              <p className="mt-2 text-sm text-zinc-400">
                {draft.scheduled_for}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}