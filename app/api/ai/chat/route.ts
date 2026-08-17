import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

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

    const { question, videos, messages } = await request.json();

    if (!question?.trim()) {
      return NextResponse.json(
        { error: "A question is required." },
        { status: 400 },
      );
    }

    const recentMessages: ChatMessage[] = Array.isArray(messages)
      ? messages.slice(-8)
      : [];

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
          temperature: 0.5,
          messages: [
            {
              role: "system",
              content: `
You are CreatorOS, an expert social-media analytics coach.

Use only the supplied video data when making factual claims.
Be concise and practical.
If there is not enough data, say so clearly.
Do not invent posting-time, audience, retention, or performance patterns.
              `.trim(),
            },
            {
              role: "user",
              content: `
Creator video data:

${JSON.stringify(videos ?? [], null, 2)}
              `.trim(),
            },
            ...recentMessages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
            {
              role: "user",
              content: question,
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

    const answer = result.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("OpenRouter returned an empty response.");
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("OpenRouter chat route error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Could not generate an AI response.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}