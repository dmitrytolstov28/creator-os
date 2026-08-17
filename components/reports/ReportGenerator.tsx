"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function ReportGenerator() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateReport() {
    setLoading(true);

    try {
      const { data: videos } = await supabase
        .from("videos")
        .select("*")
        .limit(100);

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: `
Create a professional weekly creator report.

Include:
- Executive Summary
- Top Performing Video
- Biggest Win
- Biggest Weakness
- Recommended Improvements
- Action Plan for Next Week

Format it nicely.
          `,
          videos,
          messages: [],
        }),
      });

      const result = await response.json();

      setReport(result.answer);
    } finally {
      setLoading(false);
    }
  }

  function downloadReport() {
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "CreatorOS_Report.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <FileText className="text-violet-400" />
            AI Report Generator
          </h2>

          <p className="mt-2 text-zinc-400">
            Generate a complete creator performance report.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={generateReport}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Creating...
              </>
            ) : (
              "Generate"
            )}
          </Button>

          {report && (
            <Button
  onClick={downloadReport}
  variant="outline"
  className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
>
  <Download size={16} />
  Download
</Button>
          )}
        </div>
      </div>

      {report && (
        <div className="mt-6 whitespace-pre-wrap rounded-xl border border-zinc-800 bg-black/30 p-5 leading-7 text-zinc-300">
          {report}
        </div>
      )}
    </Card>
  );
}