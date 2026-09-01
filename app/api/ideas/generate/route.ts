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

type ScoredVideo = {
  title: string;
  caption: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagement_rate: number;
  save_rate: number;
  share_rate: number;
  comment_rate: number;
  performance_score: number;
  date_posted: string | null;
  topic: string | null;
  content_type: string | null;
  hook: string | null;
  hashtags: string | null;
};

function num(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function round(value: number, decimals = 2) {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

function rate(value: number, views: number) {
  if (views <= 0) {
    return 0;
  }

  return (value / views) * 100;
}

function normalize(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.min(value / max, 1);
}

function recencyScore(datePosted: string | null) {
  if (!datePosted) {
    return 0;
  }

  const date = new Date(
    `${datePosted.slice(0, 10)}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  const daysOld = Math.max(
    0,
    Math.floor(
      (Date.now() - date.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return Math.max(0, 1 - daysOld / 180);
}

function shorten(
  value: string | null,
  maxLength: number
) {
  if (!value) {
    return null;
  }

  const cleaned = value
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength)}...`;
}

function cleanJson(content: string) {
  let cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");

  if (
    firstBracket !== -1 &&
    lastBracket !== -1 &&
    lastBracket > firstBracket
  ) {
    cleaned = cleaned.slice(
      firstBracket,
      lastBracket + 1
    );
  }

  return cleaned;
}

function compactVideo(video: ScoredVideo) {
  return {
    title:
      shorten(video.title, 120) ??
      "Untitled video",

    caption: shorten(video.caption, 240),

    views: video.views,

    engagement_rate:
      video.engagement_rate,

    save_rate:
      video.save_rate,

    share_rate:
      video.share_rate,

    performance_score:
      video.performance_score,

    date_posted:
      video.date_posted,

    topic:
      video.topic,

    content_type:
      video.content_type,

    hook:
      shorten(video.hook, 150),

    hashtags:
      shorten(video.hashtags, 180),
  };
}

function uniqueVideos(groups: ScoredVideo[][]) {
  const seen = new Set<string>();
  const result: ScoredVideo[] = [];

  for (const group of groups) {
    for (const video of group) {
      const key = [
        video.title,
        video.caption,
        video.date_posted,
      ].join("|");

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      result.push(video);
    }
  }

  return result;
}

function groupPerformance(
  videos: ScoredVideo[],
  key: "topic" | "content_type"
) {
  const groups = new Map<
    string,
    ScoredVideo[]
  >();

  for (const video of videos) {
    const raw = video[key];

    const name =
      raw && raw.trim()
        ? raw.trim()
        : "Unknown";

    const group =
      groups.get(name) ?? [];

    group.push(video);

    groups.set(name, group);
  }

  return Array.from(groups.entries())
    .map(([name, group]) => {
      const totalViews = group.reduce(
        (sum, video) =>
          sum + video.views,
        0
      );

      const averageViews =
        totalViews / group.length;

      const averageScore =
        group.reduce(
          (sum, video) =>
            sum +
            video.performance_score,
          0
        ) / group.length;

      const averageEngagement =
        group.reduce(
          (sum, video) =>
            sum +
            video.engagement_rate,
          0
        ) / group.length;

      const averageSaveRate =
        group.reduce(
          (sum, video) =>
            sum + video.save_rate,
          0
        ) / group.length;

      const averageShareRate =
        group.reduce(
          (sum, video) =>
            sum + video.share_rate,
          0
        ) / group.length;

      return {
        name,
        videos: group.length,

        average_views:
          round(averageViews),

        average_performance_score:
          round(averageScore),

        average_engagement_rate:
          round(averageEngagement),

        average_save_rate:
          round(averageSaveRate),

        average_share_rate:
          round(averageShareRate),
      };
    })
    .sort(
      (a, b) =>
        b.average_performance_score -
        a.average_performance_score
    )
    .slice(0, 8);
}

export async function POST(request: Request) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const openRouterKey =
      process.env.OPENROUTER_API_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        {
          error:
            "NEXT_PUBLIC_SUPABASE_URL is not configured.",
        },
        { status: 500 }
      );
    }

    if (!serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            "SUPABASE_SERVICE_ROLE_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    if (!openRouterKey) {
      return NextResponse.json(
        {
          error:
            "OPENROUTER_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    let userRequest = "";

    try {
      const body = await request.json();

      if (typeof body?.request === "string") {
        userRequest =
          body.request.trim();
      } else if (
        typeof body?.prompt === "string"
      ) {
        userRequest =
          body.prompt.trim();
      }
    } catch {
      userRequest = "";
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    /*
      Verify the logged-in CreatorOS user.
    */

    const authorizationHeader =
      request.headers.get("authorization");

    const accessToken =
      authorizationHeader?.startsWith("Bearer ")
        ? authorizationHeader.slice(7).trim()
        : null;

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to generate ideas.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: userData,
      error: userError,
    } = await supabase.auth.getUser(
      accessToken
    );

    if (
      userError ||
      !userData.user
    ) {
      console.error(
        "GENERATE IDEAS AUTH ERROR:",
        userError
      );

      return NextResponse.json(
        {
          error:
            "Your login session is invalid or has expired.",
        },
        {
          status: 401,
        }
      );
    }

    const userId =
      userData.user.id;

    const { data, error } = await supabase
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
        `
      )
      .eq(
        "user_id",
        userId
      )
      .order("date_posted", {
        ascending: false,
        nullsFirst: false,
      });

    if (error) {
      console.error(
        "GENERATE IDEAS ERROR:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to load videos from Supabase.",
        },
        { status: 500 }
      );
    }

    const videos =
      (data ?? []) as VideoRow[];

    if (videos.length === 0) {
      return NextResponse.json(
        {
          error:
            "No videos found. Sync Instagram first.",
        },
        { status: 400 }
      );
    }

    /*
      Analyze every synced video before
      calling the AI.
    */

    const prepared = videos.map((video) => {
      const views = num(video.views);
      const likes = num(video.likes);
      const comments = num(video.comments);
      const shares = num(video.shares);
      const saves = num(video.saves);

      return {
        title:
          video.title?.trim() ||
          "Untitled video",

        caption:
          video.caption ?? null,

        views,
        likes,
        comments,
        shares,
        saves,

        engagement_rate: rate(
          likes + comments + shares,
          views
        ),

        save_rate: rate(
          saves,
          views
        ),

        share_rate: rate(
          shares,
          views
        ),

        comment_rate: rate(
          comments,
          views
        ),

        recency_score: recencyScore(
          video.date_posted ?? null
        ),

        date_posted:
          video.date_posted ?? null,

        topic:
          video.topic ?? null,

        content_type:
          video.content_type ?? null,

        hook:
          video.hook ?? null,

        hashtags:
          video.hashtags ?? null,
      };
    });

    const maxViews = Math.max(
      ...prepared.map(
        (video) => video.views
      ),
      1
    );

    const maxSaveRate = Math.max(
      ...prepared.map(
        (video) => video.save_rate
      ),
      0.0001
    );

    const maxShareRate = Math.max(
      ...prepared.map(
        (video) => video.share_rate
      ),
      0.0001
    );

    const maxEngagementRate = Math.max(
      ...prepared.map(
        (video) =>
          video.engagement_rate
      ),
      0.0001
    );

    const maxCommentRate = Math.max(
      ...prepared.map(
        (video) =>
          video.comment_rate
      ),
      0.0001
    );

    /*
      Same AI Ideas v2 score:

      35% views
      20% save rate
      20% share rate
      10% engagement
       5% comment rate
      10% recency
    */

    const scoredVideos: ScoredVideo[] =
      prepared.map((video) => {
        const score =
          normalize(
            video.views,
            maxViews
          ) *
            0.35 +
          normalize(
            video.save_rate,
            maxSaveRate
          ) *
            0.2 +
          normalize(
            video.share_rate,
            maxShareRate
          ) *
            0.2 +
          normalize(
            video.engagement_rate,
            maxEngagementRate
          ) *
            0.1 +
          normalize(
            video.comment_rate,
            maxCommentRate
          ) *
            0.05 +
          video.recency_score * 0.1;

        return {
          title: video.title,

          caption: video.caption,

          views: video.views,

          likes: video.likes,

          comments:
            video.comments,

          shares: video.shares,

          saves: video.saves,

          engagement_rate:
            round(
              video.engagement_rate
            ),

          save_rate:
            round(
              video.save_rate
            ),

          share_rate:
            round(
              video.share_rate
            ),

          comment_rate:
            round(
              video.comment_rate
            ),

          performance_score:
            round(score * 100),

          date_posted:
            video.date_posted,

          topic: video.topic,

          content_type:
            video.content_type,

          hook: video.hook,

          hashtags:
            video.hashtags,
        };
      });

    const totalViews =
      scoredVideos.reduce(
        (sum, video) =>
          sum + video.views,
        0
      );

    const totalLikes =
      scoredVideos.reduce(
        (sum, video) =>
          sum + video.likes,
        0
      );

    const totalComments =
      scoredVideos.reduce(
        (sum, video) =>
          sum + video.comments,
        0
      );

    const totalShares =
      scoredVideos.reduce(
        (sum, video) =>
          sum + video.shares,
        0
      );

    const totalSaves =
      scoredVideos.reduce(
        (sum, video) =>
          sum + video.saves,
        0
      );

    const averageViews =
      totalViews / scoredVideos.length;

    const accountEngagementRate =
      rate(
        totalLikes +
          totalComments +
          totalShares,
        totalViews
      );

    const accountSaveRate =
      rate(
        totalSaves,
        totalViews
      );

    const accountShareRate =
      rate(
        totalShares,
        totalViews
      );

    /*
      Important evidence from different
      dimensions of performance.
    */

    const topOverall =
      [...scoredVideos]
        .sort(
          (a, b) =>
            b.performance_score -
            a.performance_score
        )
        .slice(0, 7);

    const lowestOverall =
      [...scoredVideos]
        .sort(
          (a, b) =>
            a.performance_score -
            b.performance_score
        )
        .slice(0, 5);

    const bestViews =
      [...scoredVideos]
        .sort(
          (a, b) =>
            b.views - a.views
        )
        .slice(0, 5);

    const bestSaves =
      [...scoredVideos]
        .filter(
          (video) =>
            video.views > 0
        )
        .sort(
          (a, b) =>
            b.save_rate -
            a.save_rate
        )
        .slice(0, 5);

    const bestShares =
      [...scoredVideos]
        .filter(
          (video) =>
            video.views > 0
        )
        .sort(
          (a, b) =>
            b.share_rate -
            a.share_rate
        )
        .slice(0, 5);

    const bestEngagement =
      [...scoredVideos]
        .filter(
          (video) =>
            video.views > 0
        )
        .sort(
          (a, b) =>
            b.engagement_rate -
            a.engagement_rate
        )
        .slice(0, 5);

    const recentVideos =
      [...scoredVideos]
        .filter(
          (video) =>
            video.date_posted
        )
        .sort((a, b) =>
          (
            b.date_posted ?? ""
          ).localeCompare(
            a.date_posted ?? ""
          )
        )
        .slice(0, 7);

    /*
      Deduplicate important posts so the
      prompt stays smaller while keeping
      multiple types of evidence.
    */

    const importantVideos =
      uniqueVideos([
        topOverall,
        lowestOverall,
        bestViews,
        bestSaves,
        bestShares,
        bestEngagement,
        recentVideos,
      ])
        .slice(0, 18)
        .map(compactVideo);

    /*
      Lightweight awareness of every post.

      This is especially important for
      preventing duplicate/recycled ideas.
    */

    const existingContent =
      scoredVideos.map((video) => ({
        title: shorten(
          video.title,
          100
        ),

        caption: shorten(
          video.caption,
          150
        ),

        topic:
          video.topic,

        content_type:
          video.content_type,

        hook: shorten(
          video.hook,
          100
        ),

        date_posted:
          video.date_posted,
      }));

    const topicPerformance =
      groupPerformance(
        scoredVideos,
        "topic"
      );

    const contentTypePerformance =
      groupPerformance(
        scoredVideos,
        "content_type"
      );

    const accountIntelligence = {
      totals: {
        videos:
          scoredVideos.length,

        views:
          totalViews,

        likes:
          totalLikes,

        comments:
          totalComments,

        shares:
          totalShares,

        saves:
          totalSaves,
      },

      account_averages: {
        views_per_video:
          round(averageViews),

        engagement_rate:
          round(
            accountEngagementRate
          ),

        save_rate:
          round(
            accountSaveRate
          ),

        share_rate:
          round(
            accountShareRate
          ),
      },

      topic_performance:
        topicPerformance,

      content_type_performance:
        contentTypePerformance,

      important_performance_evidence:
        importantVideos,

      existing_content_library:
        existingContent,
    };

    /*
      Restored stronger V2 reasoning prompt.

      The big difference is that the AI must
      derive NEW angles from winning patterns,
      rather than just cloning winning posts.
    */

    const prompt = `
You are the content intelligence engine inside CreatorOS.

CreatorOS analyzes a creator's REAL Instagram performance data and recommends what they should post next.

Your job is NOT to give generic social media ideas and it is NOT to simply recreate the creator's existing posts.

CreatorOS has already analyzed every synced video and calculated performance scores, account averages, topic performance and content-type performance.

Use the supplied analysis to discover WHY certain posts worked, then create genuinely NEW ideas that reuse the successful underlying patterns without copying the original concepts.

ACCOUNT INTELLIGENCE:

${JSON.stringify(
  accountIntelligence
)}

${
  userRequest
    ? `
CREATOR'S OPTIONAL REQUEST:

${userRequest}

Use this request as an additional preference, but do not ignore the account-performance evidence.
`
    : ""
}

BEFORE GENERATING IDEAS, REASON ABOUT THESE QUESTIONS:

1. Which posts clearly exceeded the account's average views, and what may have made them more appealing?

2. Which posts had unusually strong save rates, suggesting that viewers found them useful or worth returning to?

3. Which posts had unusually strong share rates, suggesting that viewers wanted other people to see them?

4. Which posts had strong engagement even when raw views were only average?

5. Which topics or themes repeatedly performed well?

6. Which hooks or opening styles appear to work?

7. Which recent posts suggest the account may be moving toward a stronger new direction?

8. Which subjects, approaches or formats underperformed and should probably not be repeated in the same way?

9. Which concepts already exist in the existing_content_library and therefore should NOT simply be recommended again?

10. What completely new angles could reuse the underlying strengths of successful posts without feeling like duplicates?

CRITICAL ORIGINALITY RULES:

- Do NOT simply remake an existing post with slightly different wording.
- Do NOT take an existing caption and turn it into essentially the same video.
- Do NOT recommend six variations of the creator's current best-performing topic.
- Do NOT assume that because one specific subject performed well, the creator should repeatedly post that exact subject.
- Look for the underlying reason a post worked: curiosity, storytelling, proof/results, educational value, relatability, controversy, transformation, suspense, useful information, strong opening, etc.
- Transfer those successful patterns into NEW concepts.
- The six recommendations should feel meaningfully different from one another.
- Each recommendation should add something new to the creator's existing content library.

QUALITY RULES:

- Return exactly 6 ideas.
- Every idea must feel specific to THIS account.
- Do not give generic creator advice.
- Do not invent statistics.
- Only reference statistics that exist in the supplied data.
- Use account averages when comparisons are useful.
- Consider views, saves, shares, engagement, recency, topics, formats, hooks and captions together.
- Hooks must be usable as the actual first spoken line or first on-screen text.
- The concept must explain clearly what the creator should actually film.
- why_it_should_work should explain the account-specific performance pattern behind the recommendation.
- Make the responses detailed enough to be genuinely useful.

EXISTING POST REFERENCE RULE:

Never identify an existing post using a number or database ID.

Never say:
"Video #5"
"Video 26"
"Post #12"

When referring to an existing post, use its title or a recognizable portion of its caption.

For example:

GOOD:
The post captioned "Wins all across the board..." had above-average engagement.

BAD:
Video #26 had above-average engagement.

OUTPUT:

Return exactly 6 objects.

Each object must contain:

{
  "title": "Clear new idea title",
  "hook": "Exact opening line or on-screen text",
  "concept": "Specific explanation of what the creator should make",
  "content_type": "Suggested format",
  "suggested_hashtags": ["#example", "#example"],
  "why_it_should_work": "Detailed explanation of why this NEW concept fits the creator's actual account patterns",
  "based_on": "Specific account-performance evidence"
}

Return valid JSON only.

Do not use markdown.
Do not use code fences.
Do not include commentary before or after the JSON.

The final JSON array MUST contain exactly 6 complete objects.
`;

    /*
      One OpenRouter request only.
    */

    const response = await fetch(
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

        body: JSON.stringify({
          model: "openrouter/free",

          messages: [
            {
              role: "system",

              content:
                "You are CreatorOS, a data-driven Instagram content intelligence system. Find the underlying patterns behind successful content and generate genuinely new ideas rather than copies of existing posts. Return only valid JSON.",
            },

            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.8,
        }),
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "OPENROUTER IDEA ERROR:",
        response.status,
        errorText
      );

      return NextResponse.json(
        {
          error:
            "OpenRouter failed to generate ideas.",
        },
        { status: 500 }
      );
    }

    const result =
      await response.json();

    const content =
      result?.choices?.[0]
        ?.message?.content;

    if (
      !content ||
      typeof content !== "string"
    ) {
      console.error(
        "OPENROUTER IDEA ERROR:",
        result
      );

      return NextResponse.json(
        {
          error:
            "OpenRouter returned an empty response.",
        },
        { status: 500 }
      );
    }

    let ideas;

    try {
      const cleaned =
        cleanJson(content);

      ideas =
        JSON.parse(cleaned);
    } catch (error) {
      console.error(
        "IDEA JSON PARSE ERROR:",
        error
      );

      console.error(
        "RAW IDEA RESPONSE:",
        content
      );

      return NextResponse.json(
        {
          error:
            "The AI responded, but its response could not be parsed as valid idea JSON.",
        },
        { status: 500 }
      );
    }

    if (!Array.isArray(ideas)) {
      return NextResponse.json(
        {
          error:
            "The AI response was not an array.",
        },
        { status: 500 }
      );
    }

    if (ideas.length !== 6) {
      console.error(
        "OPENROUTER IDEA ERROR:",
        `Expected 6 ideas but received ${ideas.length}.`
      );

      return NextResponse.json(
        {
          error:
            `The AI returned ${ideas.length} ideas instead of 6.`,
        },
        { status: 500 }
      );
    }

    const bestVideo =
      topOverall[0] ?? null;

    return NextResponse.json({
      ideas,

      analyzedVideos:
        scoredVideos.length,

      model:
        "openrouter/free",

      intelligence: {
        averageViews:
          round(averageViews),

        engagementRate:
          round(
            accountEngagementRate
          ),

        saveRate:
          round(
            accountSaveRate
          ),

        shareRate:
          round(
            accountShareRate
          ),

        topVideo:
          bestVideo
            ? {
                title:
                  bestVideo.title,

                views:
                  bestVideo.views,

                performanceScore:
                  bestVideo.performance_score,

                datePosted:
                  bestVideo.date_posted,
              }
            : null,
      },
    });
  } catch (error) {
    console.error(
      "GENERATE IDEAS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate ideas.",

        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}