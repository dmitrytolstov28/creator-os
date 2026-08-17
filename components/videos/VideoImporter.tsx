"use client";

import { FormEvent, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Link2,
  Loader2,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ImportResult = {
  title: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
};

export default function VideoImporter() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function importVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!url.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/import/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not import video.");
      }

      setResult(data.video);
      setUrl("");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not import video.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-red-500/10 p-3">
          <Video className="text-red-400" size={22} />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Import from YouTube
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Paste a public YouTube video or Shorts URL.
          </p>
        </div>
      </div>

      <form
        onSubmit={importVideo}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Link2
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <Input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            type="url"
            className="border-zinc-700 bg-black pl-10 text-white"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !url.trim()}
          className="bg-violet-600 text-white hover:bg-violet-500"
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Importing...
            </>
          ) : (
            "Import Video"
          )}
        </Button>
      </form>

      {error && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {result && (
        <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-center gap-2 text-green-300">
            <CheckCircle2 size={18} />
            <p className="font-medium">Video imported</p>
          </div>

          <p className="mt-3 font-semibold text-white">
            {result.title}
          </p>

          <div className="mt-3 flex flex-wrap gap-5 text-sm text-zinc-400">
            <span>{result.views.toLocaleString()} views</span>
            <span>{result.likes.toLocaleString()} likes</span>
            <span>{result.comments.toLocaleString()} comments</span>
          </div>
        </div>
      )}
    </Card>
  );
}