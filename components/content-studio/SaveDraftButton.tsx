"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type SaveDraftButtonProps = {
  topic: string;
  idea: string;
  title: string;
  hook: string;
  script: string;
  caption: string;
  hashtags: string[];
  cta: string;
  thumbnailIdea: string;
  bRollIdeas: string[];
};

export default function SaveDraftButton({
  topic,
  idea,
  title,
  hook,
  script,
  caption,
  hashtags,
  cta,
  thumbnailIdea,
  bRollIdeas,
}: SaveDraftButtonProps) {
  const [saving, setSaving] = useState(false);

  async function saveDraft() {
    setSaving(true);

    const { error } = await supabase
      .from("content_drafts")
      .insert({
        topic,
        idea,
        title,
        hook,
        script,
        caption,
        hashtags,
        cta,
        thumbnail_idea: thumbnailIdea,
        b_roll_ideas: bRollIdeas,
        status: "Draft",
      });

    setSaving(false);

    if (error) {
      console.error(error);
      toast.error("Could not save draft");
      return;
    }

    toast.success("Draft saved");
  }

  return (
    <Button
      type="button"
      onClick={saveDraft}
      disabled={saving}
      className="bg-violet-600 text-white hover:bg-violet-500"
    >
      {saving ? (
        <Loader2 size={17} className="animate-spin" />
      ) : (
        <Save size={17} />
      )}

      {saving ? "Saving..." : "Save Draft"}
    </Button>
  );
}