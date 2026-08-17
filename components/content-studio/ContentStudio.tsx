"use client";

import { FormEvent, useState } from "react";
import {
  Copy,
  Loader2,
  RefreshCw,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import StudioActions from "./StudioActions";
import SaveDraftButton from "./SaveDraftButton";

type StudioResult = {
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

export default function ContentStudio() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<StudioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!topic.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const { data: videos, error: videosError } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (videosError) {
        throw videosError;
      }

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: `
Create a complete short-form content package about:

"${topic}"

Use my existing content data to make the idea fit my best-performing style.

Return ONLY valid JSON in this exact format:

{
  "idea": "string",
  "title": "string",
  "hook": "string",
  "script": "string",
  "caption": "string",
  "hashtags": ["string", "string", "string", "string", "string"],
  "cta": "string",
  "thumbnailIdea": "string",
  "bRollIdeas": ["string", "string", "string"]
}
          `,
          videos: videos ?? [],
          messages: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not generate content.");
      }

      const cleaned = String(data.answer)
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      setResult(JSON.parse(cleaned));
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not generate content.",
      );
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-6">
      <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-violet-500/15 p-3">
            <WandSparkles className="text-violet-400" size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              AI Content Studio
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Turn one idea into a complete Reel package.
            </p>
          </div>
        </div>

        <form
          onSubmit={generate}
          className="mt-6 flex flex-col gap-3 md:flex-row"
        >
          <Input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Example: revenge trading after a losing day"
            className="border-zinc-700 bg-black text-white"
          />

          <Button
            type="submit"
            disabled={loading || !topic.trim()}
            className="bg-violet-600 text-white hover:bg-violet-500"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Generate
              </>
            )}
          </Button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}
      </Card>

      {result && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <StudioCard
              title="Idea"
              value={result.idea}
              onCopy={() => copyText(result.idea)}
            />

            <StudioCard
              title="Title"
              value={result.title}
              onCopy={() => copyText(result.title)}
            />

            <StudioCard
              title="Hook"
              value={result.hook}
              onCopy={() => copyText(result.hook)}
            />

            <StudioCard
              title="CTA"
              value={result.cta}
              onCopy={() => copyText(result.cta)}
            />
          </div>

          <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Script</h2>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => copyText(result.script)}
                className="text-zinc-400 hover:text-white"
              >
                <Copy size={17} />
              </Button>
            </div>

            <Textarea
              value={result.script}
              readOnly
              className="mt-4 min-h-64 border-zinc-700 bg-black text-white"
            />
          </Card>

          <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Caption</h2>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => copyText(result.caption)}
                className="text-zinc-400 hover:text-white"
              >
                <Copy size={17} />
              </Button>
            </div>

            <p className="mt-4 whitespace-pre-wrap leading-7 text-zinc-300">
              {result.caption}
            </p>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
              <h2 className="text-xl font-semibold">
                Hashtags
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {result.hashtags.map((hashtag) => (
                  <span
                    key={hashtag}
                    className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-300"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
              <h2 className="text-xl font-semibold">
                Thumbnail Idea
              </h2>

              <p className="mt-4 leading-7 text-zinc-300">
                {result.thumbnailIdea}
              </p>
            </Card>
          </div>

          <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
            <h2 className="text-xl font-semibold">
              B-Roll Ideas
            </h2>

            <div className="mt-4 space-y-3">
              {result.bRollIdeas.map((idea, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-zinc-300"
                >
                  {idea}
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
  <div className="flex flex-wrap gap-3">
  <SaveDraftButton
    topic={topic}
    idea={result.idea}
    title={result.title}
    hook={result.hook}
    script={result.script}
    caption={result.caption}
    hashtags={result.hashtags}
    cta={result.cta}
    thumbnailIdea={result.thumbnailIdea}
    bRollIdeas={result.bRollIdeas}
  />

  <StudioActions
    onSchedule={() => alert("Calendar integration coming next 📅")}
    onCopyAll={() => {
      navigator.clipboard.writeText(`
IDEA
${result.idea}

TITLE
${result.title}

HOOK
${result.hook}

SCRIPT
${result.script}

CAPTION
${result.caption}

HASHTAGS
${result.hashtags.join(" ")}

CTA
${result.cta}

THUMBNAIL
${result.thumbnailIdea}

B-ROLL
${result.bRollIdeas.join("\n")}
      `);
    }}
  />
</div>

  <Button
    type="button"
    onClick={() =>
      generate({
        preventDefault() {},
      } as FormEvent<HTMLFormElement>)
    }
    className="bg-zinc-800 text-white hover:bg-zinc-700"
  >
    <RefreshCw size={17} />
    Generate Another
  </Button>
</div>
        </>
      )}
    </div>
  );
}

function StudioCard({
  title,
  value,
  onCopy,
}: {
  title: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCopy}
          className="text-zinc-400 hover:text-white"
        >
          <Copy size={16} />
        </Button>
      </div>

      <p className="mt-4 leading-7 text-zinc-300">
        {value}
      </p>
    </Card>
  );
}