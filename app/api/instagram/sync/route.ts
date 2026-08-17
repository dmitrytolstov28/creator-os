import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const GRAPH_VERSION = "v23.0";

type InstagramMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
};

type InstagramMediaResponse = {
  data?: InstagramMedia[];
  paging?: {
    next?: string;
  };
  error?: {
    message?: string;
    type?: string;
    code?: number;
  };
};

type InsightValue = {
  value?: number;
};

type InsightItem = {
  name?: string;
  values?: InsightValue[];
};

type InsightResponse = {
  data?: InsightItem[];
  error?: {
    message?: string;
    type?: string;
    code?: number;
  };
};

type ReelInsights = {
  views: number;
  shares: number;
  saves: number;
  reach: number;
};

function createTitle(caption?: string) {
  if (!caption) {
    return "Instagram Reel";
  }

  const firstLine =
    caption
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.length > 0) ||
    caption.trim();

  if (firstLine.length <= 80) {
    return firstLine;
  }

  return `${firstLine.slice(0, 77)}...`;
}

function extractHashtags(caption?: string) {
  if (!caption) {
    return null;
  }

  const matches =
    caption.match(/#[\p{L}\p{N}_]+/gu);

  if (!matches || matches.length === 0) {
    return null;
  }

  return matches.join(" ");
}

function getDatePosted(timestamp?: string) {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

async function fetchInstagramMedia(
  instagramUserId: string,
  accessToken: string,
) {
  const allMedia: InstagramMedia[] = [];

  const fields = [
    "id",
    "caption",
    "media_type",
    "media_product_type",
    "media_url",
    "thumbnail_url",
    "permalink",
    "timestamp",
    "like_count",
    "comments_count",
  ].join(",");

  let nextUrl: string | null =
    `https://graph.facebook.com/${GRAPH_VERSION}/${instagramUserId}/media` +
    `?fields=${encodeURIComponent(fields)}` +
    `&limit=100` +
    `&access_token=${encodeURIComponent(accessToken)}`;

  let pageCount = 0;

  while (nextUrl && pageCount < 10) {
    const response = await fetch(nextUrl, {
      method: "GET",
      cache: "no-store",
    });

    const data =
      (await response.json()) as InstagramMediaResponse;

    if (!response.ok || data.error) {
      console.error(
        "INSTAGRAM MEDIA FETCH ERROR:",
        data,
      );

      throw new Error(
        data.error?.message ||
          "Unable to fetch Instagram media.",
      );
    }

    if (Array.isArray(data.data)) {
      allMedia.push(...data.data);
    }

    nextUrl = data.paging?.next || null;

    pageCount += 1;
  }

  return allMedia;
}

async function fetchReelInsights(
  mediaId: string,
  accessToken: string,
): Promise<ReelInsights> {
  /*
   * IMPORTANT:
   * "plays" is NOT valid for the Graph API response
   * we're currently getting.
   *
   * Meta explicitly returned these as valid:
   * views
   * reach
   * shares
   * saved
   */
  const metrics = [
    "views",
    "reach",
    "shares",
    "saved",
  ];

  const insightsUrl =
    `https://graph.facebook.com/${GRAPH_VERSION}/${mediaId}/insights` +
    `?metric=${encodeURIComponent(metrics.join(","))}` +
    `&access_token=${encodeURIComponent(accessToken)}`;

  const response = await fetch(insightsUrl, {
    method: "GET",
    cache: "no-store",
  });

  const data =
    (await response.json()) as InsightResponse;

  if (!response.ok || data.error) {
    console.error(
      "INSTAGRAM INSIGHTS ERROR:",
      {
        mediaId,
        error: data,
      },
    );

    return {
      views: 0,
      reach: 0,
      shares: 0,
      saves: 0,
    };
  }

  const result: ReelInsights = {
    views: 0,
    reach: 0,
    shares: 0,
    saves: 0,
  };

  for (const item of data.data ?? []) {
    const value =
      item.values?.[0]?.value ?? 0;

    switch (item.name) {
      case "views":
        result.views = value;
        break;

      case "reach":
        result.reach = value;
        break;

      case "shares":
        result.shares = value;
        break;

      case "saved":
        result.saves = value;
        break;
    }
  }

  console.log(
    "INSTAGRAM INSIGHTS LOADED:",
    {
      mediaId,
      views: result.views,
      reach: result.reach,
      shares: result.shares,
      saves: result.saves,
    },
  );

  return result;
}

export async function POST() {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing Supabase server environment variables.",
        },
        {
          status: 500,
        },
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    /*
     * STEP 1
     * Load Instagram connection.
     */
    const {
      data: connection,
      error: connectionError,
    } = await supabase
      .from("instagram_connections")
      .select(
        `
        id,
        instagram_user_id,
        username,
        access_token
        `,
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (connectionError) {
      console.error(
        "INSTAGRAM CONNECTION READ ERROR:",
        connectionError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to read Instagram connection.",
        },
        {
          status: 500,
        },
      );
    }

    if (!connection) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Instagram is not connected.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      !connection.instagram_user_id ||
      !connection.access_token
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Instagram connection is missing credentials.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * STEP 2
     * Fetch Instagram media.
     */
    const media =
      await fetchInstagramMedia(
        connection.instagram_user_id,
        connection.access_token,
      );

    const videos = media.filter(
      (item) => {
        const mediaType =
          item.media_type?.toUpperCase();

        const productType =
          item.media_product_type?.toUpperCase();

        return (
          mediaType === "VIDEO" ||
          productType === "REELS" ||
          productType === "REEL"
        );
      },
    );

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let insightsLoaded = 0;

    /*
     * STEP 3
     * Sync each Instagram video/Reel.
     */
    for (const video of videos) {
      if (!video.permalink) {
        skipped += 1;
        continue;
      }

      const insights =
        await fetchReelInsights(
          video.id,
          connection.access_token,
        );

      /*
       * Count insight response as loaded
       * when Meta gave us any non-zero metric.
       */
      if (
        insights.views > 0 ||
        insights.reach > 0 ||
        insights.shares > 0 ||
        insights.saves > 0
      ) {
        insightsLoaded += 1;
      }

      const {
        data: existingVideo,
        error: existingError,
      } = await supabase
        .from("videos")
        .select("id")
        .eq(
          "post_url",
          video.permalink,
        )
        .limit(1)
        .maybeSingle();

      if (existingError) {
        console.error(
          "VIDEO LOOKUP ERROR:",
          existingError,
        );

        skipped += 1;
        continue;
      }

      const syncedFields = {
        platform: "Instagram",

        views:
          insights.views,

        likes:
          typeof video.like_count ===
          "number"
            ? video.like_count
            : 0,

        comments:
          typeof video.comments_count ===
          "number"
            ? video.comments_count
            : 0,

        shares:
          insights.shares,

        saves:
          insights.saves,

        caption:
          video.caption || null,

        hashtags:
          extractHashtags(
            video.caption,
          ),

        date_posted:
          getDatePosted(
            video.timestamp,
          ),

        content_type:
          video.media_product_type ===
            "REELS" ||
          video.media_product_type ===
            "REEL"
            ? "Reel"
            : "Video",

        video_url:
          video.media_url || null,

        thumbnail_url:
          video.thumbnail_url || null,

        post_url:
          video.permalink,

        status: "Posted",
      };

      /*
       * UPDATE EXISTING VIDEO
       */
      if (existingVideo) {
        const {
          error: updateError,
        } = await supabase
          .from("videos")
          .update(syncedFields)
          .eq(
            "id",
            existingVideo.id,
          );

        if (updateError) {
          console.error(
            "INSTAGRAM VIDEO UPDATE ERROR:",
            {
              permalink:
                video.permalink,
              error:
                updateError,
            },
          );

          skipped += 1;
          continue;
        }

        updated += 1;
        continue;
      }

      /*
       * INSERT NEW VIDEO
       */
      const newVideo = {
        title:
          createTitle(
            video.caption,
          ),

        platform:
          "Instagram",

        views:
          insights.views,

        likes:
          typeof video.like_count ===
          "number"
            ? video.like_count
            : 0,

        comments:
          typeof video.comments_count ===
          "number"
            ? video.comments_count
            : 0,

        shares:
          insights.shares,

        saves:
          insights.saves,

        followers_gained: 0,

        date_posted:
          getDatePosted(
            video.timestamp,
          ),

        video_length: null,

        hook: null,

        caption:
          video.caption || null,

        hashtags:
          extractHashtags(
            video.caption,
          ),

        sound: null,

        topic: null,

        content_type:
          video.media_product_type ===
            "REELS" ||
          video.media_product_type ===
            "REEL"
            ? "Reel"
            : "Video",

        cta: null,

        video_url:
          video.media_url || null,

        notes: null,

        scheduled_date: null,

        scheduled_time: null,

        status: "Posted",

        thumbnail_url:
          video.thumbnail_url || null,

        post_url:
          video.permalink,
      };

      const {
        error: insertError,
      } = await supabase
        .from("videos")
        .insert(newVideo);

      if (insertError) {
        console.error(
          "INSTAGRAM VIDEO INSERT ERROR:",
          {
            permalink:
              video.permalink,
            error:
              insertError,
          },
        );

        skipped += 1;
        continue;
      }

      inserted += 1;
    }

    console.log(
      "INSTAGRAM SYNC COMPLETE:",
      {
        account:
          connection.username,

        totalMedia:
          media.length,

        videosFound:
          videos.length,

        insightsLoaded,

        inserted,

        updated,

        skipped,
      },
    );

    return NextResponse.json({
      success: true,

      username:
        connection.username,

      totalMedia:
        media.length,

      videosFound:
        videos.length,

      insightsLoaded,

      inserted,

      updated,

      skipped,
    });
  } catch (error) {
    console.error(
      "INSTAGRAM SYNC FAILED:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Instagram sync failed.",
      },
      {
        status: 500,
      },
    );
  }
}