import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type VideoRow = {
  title?: string | null;
  views?: number | null;
  likes?: number | null;
  comments?: number | null;
  shares?: number | null;
  saves?: number | null;
  date_posted?: string | null;
  topic?: string | null;
  content_type?: string | null;
  hook?: string | null;
  caption?: string | null;
  hashtags?: string | null;
};

type AnalyzedVideo = {
  title: string;
  caption: string | null;
  date_posted: string | null;

  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;

  engagement_rate: number;
  save_rate: number;
  share_rate: number;

  topic: string | null;
  content_type: string | null;
  hook: string | null;
};

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

type AssistantAnalysis = {
  headline: string;
  summary: string;
  metrics: Metric[];
  insights: Insight[];
  next_moves: string[];
  confidence: "high" | "medium" | "low";
};

function safeNumber(value: unknown) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function percentage(
  numerator: number,
  denominator: number,
) {
  if (denominator <= 0) {
    return 0;
  }

  return (
    (numerator / denominator) *
    100
  );
}

function round(
  value: number,
  decimals = 2,
) {
  const multiplier =
    10 ** decimals;

  return (
    Math.round(
      value * multiplier,
    ) / multiplier
  );
}

function average(
  values: number[],
) {
  if (!values.length) {
    return 0;
  }

  return (
    values.reduce(
      (total, value) =>
        total + value,
      0,
    ) / values.length
  );
}

function shorten(
  value: string | null,
  max = 180,
) {
  if (!value) {
    return null;
  }

  const cleaned =
    value
      .replace(/\s+/g, " ")
      .trim();

  if (
    cleaned.length <= max
  ) {
    return cleaned;
  }

  return `${cleaned.slice(
    0,
    max,
  )}...`;
}

function extractJSON(
  text: string,
) {
  const cleaned =
    text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

  const firstBrace =
    cleaned.indexOf("{");

  const lastBrace =
    cleaned.lastIndexOf("}");

  if (
    firstBrace === -1 ||
    lastBrace === -1
  ) {
    throw new Error(
      "AI response did not contain JSON.",
    );
  }

  const jsonText =
    cleaned
      .slice(
        firstBrace,
        lastBrace + 1,
      )
      .replace(
        /\\U([0-9a-fA-F]{8})/g,
        (_match, hex: string) =>
          String.fromCodePoint(
            Number.parseInt(
              hex,
              16,
            ),
          ),
      );

  return JSON.parse(
    jsonText,
  );
}

async function callOpenRouter(
  openRouterKey: string,
  prompt: string,
) {
  const response =
    await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${openRouterKey}`,

          "Content-Type":
            "application/json",

          "HTTP-Referer":
            process.env
              .NEXT_PUBLIC_SITE_URL ||
            "http://localhost:3000",

          "X-OpenRouter-Title":
            "CreatorOS",
        },

        body:
          JSON.stringify({
            model:
              "openrouter/free",

            messages: [
              {
                role:
                  "system",

                content:
                  "You are CreatorOS AI Assistant, a careful Instagram performance analyst. Return only the requested JSON object.",
              },

              {
                role:
                  "user",

                content:
                  prompt,
              },
            ],

            response_format: {
              type:
                "json_object",
            },

            temperature:
              0.3,
          }),
      },
    );

  if (!response.ok) {
    const text =
      await response.text();

    throw new Error(
      `OpenRouter error ${response.status}: ${text}`,
    );
  }

  const result =
    await response.json();

  const raw =
    result?.choices?.[0]
      ?.message?.content;

  if (
    !raw ||
    typeof raw !==
      "string"
  ) {
    throw new Error(
      "OpenRouter returned an empty response.",
    );
  }

  return raw;
}

export async function POST(
  request: Request,
) {
  try {
    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    const openRouterKey =
      process.env
        .OPENROUTER_API_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      return NextResponse.json(
        {
          error:
            "Supabase configuration is missing.",
        },
        {
          status: 500,
        },
      );
    }

    if (!openRouterKey) {
      return NextResponse.json(
        {
          error:
            "OPENROUTER_API_KEY is missing.",
        },
        {
          status: 500,
        },
      );
    }

    const body =
      await request.json();

    const question =
      typeof body?.question ===
        "string"
        ? body.question.trim()
        : "";

    if (!question) {
      return NextResponse.json(
        {
          error:
            "Please enter a question.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            persistSession:
              false,

            autoRefreshToken:
              false,
          },
        },
      );

    /*
      Verify the logged-in CreatorOS user.
    */

    const authorizationHeader =
      request.headers.get(
        "authorization",
      );

    const accessToken =
      authorizationHeader?.startsWith(
        "Bearer ",
      )
        ? authorizationHeader
            .slice(7)
            .trim()
        : null;

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to use AI Assistant.",
        },
        {
          status: 401,
        },
      );
    }

    const {
      data: userData,
      error: userError,
    } =
      await supabase.auth.getUser(
        accessToken,
      );

    if (
      userError ||
      !userData.user
    ) {
      console.error(
        "AI ASSISTANT AUTH ERROR:",
        userError,
      );

      return NextResponse.json(
        {
          error:
            "Your login session is invalid or has expired.",
        },
        {
          status: 401,
        },
      );
    }

    const userId =
      userData.user.id;

    const {
      data,
      error,
    } =
      await supabase
        .from("videos")
        .select(
          `
            title,
            views,
            likes,
            comments,
            shares,
            saves,
            date_posted,
            topic,
            content_type,
            hook,
            caption,
            hashtags
          `,
        )
        .eq(
          "user_id",
          userId,
        )
        .order(
          "date_posted",
          {
            ascending:
              false,

            nullsFirst:
              false,
          },
        );

    if (error) {
      console.error(
        "AI ASSISTANT SUPABASE ERROR:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Could not load Instagram data.",
        },
        {
          status: 500,
        },
      );
    }

    const rows =
      (data ??
        []) as VideoRow[];

    if (!rows.length) {
      return NextResponse.json(
        {
          error:
            "No synced videos found.",
        },
        {
          status: 400,
        },
      );
    }

    const videos:
      AnalyzedVideo[] =
      rows.map(
        (video) => {
          const views =
            safeNumber(
              video.views,
            );

          const likes =
            safeNumber(
              video.likes,
            );

          const comments =
            safeNumber(
              video.comments,
            );

          const shares =
            safeNumber(
              video.shares,
            );

          const saves =
            safeNumber(
              video.saves,
            );

          return {
            title:
              video.title?.trim() ||
              "Untitled post",

            caption:
              video.caption ??
              null,

            date_posted:
              video.date_posted ??
              null,

            views,
            likes,
            comments,
            shares,
            saves,

            engagement_rate:
              round(
                percentage(
                  likes +
                    comments +
                    shares,
                  views,
                ),
              ),

            save_rate:
              round(
                percentage(
                  saves,
                  views,
                ),
              ),

            share_rate:
              round(
                percentage(
                  shares,
                  views,
                ),
              ),

            topic:
              video.topic ??
              null,

            content_type:
              video.content_type ??
              null,

            hook:
              video.hook ??
              null,
          };
        },
      );

    const totalViews =
      videos.reduce(
        (sum, video) =>
          sum + video.views,
        0,
      );

    const totalLikes =
      videos.reduce(
        (sum, video) =>
          sum + video.likes,
        0,
      );

    const totalComments =
      videos.reduce(
        (sum, video) =>
          sum +
          video.comments,
        0,
      );

    const totalShares =
      videos.reduce(
        (sum, video) =>
          sum + video.shares,
        0,
      );

    const totalSaves =
      videos.reduce(
        (sum, video) =>
          sum + video.saves,
        0,
      );

    const averageViews =
      average(
        videos.map(
          (video) =>
            video.views,
        ),
      );

    const engagementRate =
      percentage(
        totalLikes +
          totalComments +
          totalShares,
        totalViews,
      );

    const saveRate =
      percentage(
        totalSaves,
        totalViews,
      );

    const shareRate =
      percentage(
        totalShares,
        totalViews,
      );

    const recentFive =
      videos.slice(0, 5);

    const previousFive =
      videos.slice(5, 10);

    const recentViews =
      average(
        recentFive.map(
          (video) =>
            video.views,
        ),
      );

    const previousViews =
      average(
        previousFive.map(
          (video) =>
            video.views,
        ),
      );

    const recentChange =
      previousViews > 0
        ? percentage(
            recentViews -
              previousViews,
            previousViews,
          )
        : 0;

    const strongestByViews =
      [...videos]
        .sort(
          (a, b) =>
            b.views -
            a.views,
        )
        .slice(0, 5);

    const strongestByEngagement =
      [...videos]
        .sort(
          (a, b) =>
            b.engagement_rate -
            a.engagement_rate,
        )
        .slice(0, 5);

    const strongestBySaves =
      [...videos]
        .filter(
          (video) =>
            video.views > 0,
        )
        .sort(
          (a, b) =>
            b.save_rate -
            a.save_rate,
        )
        .slice(0, 5);

    const strongestByShares =
      [...videos]
        .filter(
          (video) =>
            video.views > 0,
        )
        .sort(
          (a, b) =>
            b.share_rate -
            a.share_rate,
        )
        .slice(0, 5);

    const compactVideos =
      videos.map(
        (video) => ({
          title:
            shorten(
              video.title,
              90,
            ),

          caption:
            shorten(
              video.caption,
              160,
            ),

          date_posted:
            video.date_posted,

          views:
            video.views,

          engagement_rate:
            video.engagement_rate,

          save_rate:
            video.save_rate,

          share_rate:
            video.share_rate,

          topic:
            video.topic,

          content_type:
            video.content_type,

          hook:
            shorten(
              video.hook,
              100,
            ),
        }),
      );

    const context = {
      account: {
        videos:
          videos.length,

        average_views:
          round(
            averageViews,
          ),

        engagement_rate:
          round(
            engagementRate,
          ),

        save_rate:
          round(
            saveRate,
          ),

        share_rate:
          round(
            shareRate,
          ),
      },

      recent_comparison: {
        last_5_average_views:
          round(
            recentViews,
          ),

        previous_5_average_views:
          round(
            previousViews,
          ),

        change_percent:
          round(
            recentChange,
          ),
      },

      strongest_posts: {
        views:
          strongestByViews,

        engagement:
          strongestByEngagement,

        saves:
          strongestBySaves,

        shares:
          strongestByShares,
      },

      recent_posts:
        recentFive,

      all_posts:
        compactVideos,
    };

    const prompt = `
Analyze this creator's Instagram account and answer the question using only the supplied data.

QUESTION:
${question}

ACCOUNT DATA:
${JSON.stringify(context)}

Your job is to explain what the data shows without pretending you can see Instagram's internal algorithm.

REASONING RULES:

1. Separate observations from possible explanations.

2. Observations must be directly supported by the supplied data, such as:
- views increased or decreased
- save rate is higher or lower
- share rate is higher or lower
- engagement changed
- certain posts repeatedly performed better
- recent posts differ from older posts
- certain captions, hooks, topics, or formats appear often among stronger posts

3. Possible explanations are interpretations, such as:
- a hook may have created more curiosity
- a post may have been more relatable
- a topic may have been more shareable
- educational value may have helped
- a post may have encouraged more saves

4. Never present a possible explanation as proven fact.

5. Use cautious wording when discussing causes, such as:
- The data suggests...
- This may be contributing...
- One possible explanation is...
- The strongest evidence points to...
- This pattern is consistent with...
- The available data does not prove...

6. Do not claim to know why Instagram distributed or suppressed a post.

7. Do not invent qualities about a post that are not reasonably supported by its caption, hook, topic, or metrics.

8. Do not overreact to one post. Look for repeated patterns whenever possible.

9. Compare against the creator's own account averages and recent history when useful.

10. Do not flood the response with every available metric.

11. Avoid generic advice unless the account data specifically supports it.

12. Do not give the creator a score, grade, ranking, or health rating.

13. Never refer to database IDs or call posts Video #1, Video #2, and so on.

14. Refer to specific posts using their title or a recognizable caption.

15. Keep the analysis concise and focused.

Return exactly one JSON object with this structure:

{
  "headline": "Short conclusion",
  "summary": "2-3 concise sentences",
  "metrics": [
    {
      "label": "Metric name",
      "value": "Value",
      "context": "Short factual context"
    }
  ],
  "insights": [
    {
      "title": "Insight title",
      "detail": "What the data shows and, when appropriate, a clearly labeled possible explanation.",
      "evidence": "Specific account evidence supporting the observation."
    }
  ],
  "next_moves": [
    "Specific action based on the evidence",
    "Specific action based on the evidence"
  ],
  "confidence": "high"
}

OUTPUT RULES:

- headline should usually be under 12 words
- summary maximum 3 sentences
- metrics maximum 3
- insights maximum 3
- next_moves maximum 2
- evidence must be factual and specific
- do not include markdown
- do not include asterisks
- do not include extra keys
- confidence must be high, medium, or low
- if evidence is mixed or limited, use medium or low confidence
`;

    let raw =
      "";

    let analysis:
      AssistantAnalysis | null =
      null;

    /*
      The free router can occasionally select
      a model that does not follow the requested
      JSON format.

      Try twice before returning an error.
    */

    for (
      let attempt = 0;
      attempt < 2;
      attempt += 1
    ) {
      try {
        raw =
          await callOpenRouter(
            openRouterKey,
            prompt,
          );

        analysis =
          extractJSON(
            raw,
          ) as AssistantAnalysis;

        break;
      } catch (error) {
        console.error(
          `AI ASSISTANT ATTEMPT ${attempt + 1} FAILED:`,
          error,
        );

        console.error(
          "RAW AI RESPONSE:",
          raw,
        );
      }
    }

    if (!analysis) {
      return NextResponse.json(
        {
          error:
            "CreatorOS could not format the analysis. Please try again.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      analysis,

      analyzedVideos:
        videos.length,

      model:
        "openrouter/free",
    });
  } catch (error) {
    console.error(
      "AI ASSISTANT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not analyze your account.",
      },
      {
        status: 500,
      },
    );
  }
}