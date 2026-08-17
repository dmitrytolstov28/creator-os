import { NextResponse } from "next/server";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is missing from .env.local." },
        { status: 500 },
      );
    }

    const { videos } = await request.json();

    if (!Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json(
        { error: "No video data was provided." },
        { status: 400 },
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "CreatorOS",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          temperature: 0.6,
          messages: [
            {
              role: "system",
              content:
                "You are an expert social media growth coach. Return valid JSON only, with no markdown.",
            },
            {
              role: "user",
              content: `
Analyze this creator's video data:

${JSON.stringify(videos, null, 2)}

Base every claim only on the supplied data.

Return exactly this JSON structure:

{
  "summary": "string",
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "nextVideoIdea": "string",
  "score": 0
}
              `,
            },
          ],
        }),
      },
    );

    const result = (await response.json()) as OpenRouterResponse;

    if (!response.ok) {
      throw new Error(
        result.error?.message || "OpenRouter request failed.",
      );
    }

    const text = result.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("OpenRouter returned an empty response.");
    }

    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return NextResponse.json(JSON.parse(cleanedText));
  } catch (error) {
    console.error("OpenRouter route error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate AI insights.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}