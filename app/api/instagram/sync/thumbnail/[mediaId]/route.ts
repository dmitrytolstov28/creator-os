import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

const GRAPH_VERSION =
  "v23.0";

type MetaMediaResponse = {
  id?: string;

  media_type?: string;

  media_url?: string;

  thumbnail_url?: string;

  error?: {
    message?: string;
    type?: string;
    code?: number;
  };
};

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      mediaId: string;
    }>;
  },
) {
  try {
    const {
      mediaId,
    } =
      await context.params;

    if (!mediaId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing Instagram media ID.",
        },
        {
          status: 400,
        },
      );
    }

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
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

    const authorizationHeader =
      request.headers.get(
        "authorization",
      );

    const creatorAccessToken =
      authorizationHeader?.startsWith(
        "Bearer ",
      )
        ? authorizationHeader
            .slice(7)
            .trim()
        : null;

    if (
      !creatorAccessToken
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be logged in.",
        },
        {
          status: 401,
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

    const {
      data: userData,
      error: userError,
    } =
      await supabase.auth.getUser(
        creatorAccessToken,
      );

    if (
      userError ||
      !userData.user
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid CreatorOS session.",
        },
        {
          status: 401,
        },
      );
    }

    const userId =
      userData.user.id;

    /*
     * Security:
     * Verify this Instagram media ID
     * actually belongs to a video
     * owned by this CreatorOS user.
     */
    const {
      data: video,
      error: videoError,
    } =
      await supabase
        .from("videos")
        .select(
          "id, instagram_media_id",
        )
        .eq(
          "user_id",
          userId,
        )
        .eq(
          "instagram_media_id",
          mediaId,
        )
        .limit(1)
        .maybeSingle();

    if (videoError) {
      console.error(
        "THUMBNAIL VIDEO LOOKUP ERROR:",
        videoError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify video.",
        },
        {
          status: 500,
        },
      );
    }

    if (!video) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Video not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Load this CreatorOS user's
     * Instagram access token.
     */
    const {
      data: connection,
      error:
        connectionError,
    } =
      await supabase
        .from(
          "instagram_connections",
        )
        .select(
          "access_token",
        )
        .eq(
          "user_id",
          userId,
        )
        .order(
          "created_at",
          {
            ascending: false,
          },
        )
        .limit(1)
        .maybeSingle();

    if (
      connectionError
    ) {
      console.error(
        "THUMBNAIL CONNECTION ERROR:",
        connectionError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load Instagram connection.",
        },
        {
          status: 500,
        },
      );
    }

    if (
      !connection?.access_token
    ) {
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

    /*
     * Ask Meta for a NEW signed URL.
     */
    const mediaUrl =
      new URL(
        `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(
          mediaId,
        )}`,
      );

    mediaUrl.searchParams.set(
      "fields",
      "id,media_type,media_url,thumbnail_url",
    );

    mediaUrl.searchParams.set(
      "access_token",
      connection.access_token,
    );

    const metaResponse =
      await fetch(
        mediaUrl.toString(),
        {
          method: "GET",
          cache: "no-store",
        },
      );

    const metaData =
      (await metaResponse.json()) as
        MetaMediaResponse;

    if (
      !metaResponse.ok ||
      metaData.error
    ) {
      console.error(
        "META THUMBNAIL REFRESH ERROR:",
        {
          mediaId,
          error:
            metaData,
        },
      );

      return NextResponse.json(
        {
          success: false,
          error:
            metaData.error
              ?.message ||
            "Unable to refresh Instagram thumbnail.",
        },
        {
          status: 502,
        },
      );
    }

    const freshThumbnailUrl =
      metaData.thumbnail_url ||
      metaData.media_url ||
      null;

    if (
      !freshThumbnailUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Meta did not return a thumbnail URL.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,

        thumbnailUrl:
          freshThumbnailUrl,
      },
      {
        headers: {
          "Cache-Control":
            "private, no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "INSTAGRAM THUMBNAIL ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof
          Error
            ? error.message
            : "Unable to load Instagram thumbnail.",
      },
      {
        status: 500,
      },
    );
  }
}