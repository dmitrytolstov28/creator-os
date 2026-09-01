import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

import crypto from "crypto";

const GRAPH_VERSION = "v23.0";

function readState(
  state: string,
  secret: string,
) {
  const [
    payload,
    signature,
  ] = state.split(".");

  if (
    !payload ||
    !signature
  ) {
    return null;
  }

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        secret,
      )
      .update(payload)
      .digest("base64url");

  const expectedBuffer =
    Buffer.from(
      expectedSignature,
    );

  const receivedBuffer =
    Buffer.from(signature);

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return null;
  }

  if (
    !crypto.timingSafeEqual(
      expectedBuffer,
      receivedBuffer,
    )
  ) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(
        Buffer.from(
          payload,
          "base64url",
        ).toString("utf8"),
      ) as {
        userId?: string;
        expiresAt?: number;
      };

    if (
      !parsed.userId ||
      !parsed.expiresAt ||
      parsed.expiresAt < Date.now()
    ) {
      return null;
    }

    return {
      userId:
        parsed.userId,
    };
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
) {
  try {
    const {
      searchParams,
    } = new URL(request.url);

    const code =
      searchParams.get("code");

    const state =
      searchParams.get("state");

    const error =
      searchParams.get("error");

    const errorDescription =
      searchParams.get(
        "error_description",
      );

    if (error) {
      console.error(
        "Instagram OAuth error:",
        {
          error,
          errorDescription,
        },
      );

      return NextResponse.redirect(
        new URL(
          `/settings?error=${encodeURIComponent(
            errorDescription ||
              error,
          )}`,
          request.url,
        ),
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(
          "/settings?error=missing_code",
          request.url,
        ),
      );
    }

    if (!state) {
      return NextResponse.redirect(
        new URL(
          "/settings?error=missing_oauth_state",
          request.url,
        ),
      );
    }

    const appId =
      process.env.META_APP_ID;

    const appSecret =
      process.env.META_APP_SECRET;

    const redirectUri =
      process.env.META_REDIRECT_URI;

    const pageId =
      process.env.META_PAGE_ID;

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const supabaseServiceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    const stateSecret =
      process.env
        .INSTAGRAM_OAUTH_STATE_SECRET ||
      supabaseServiceRoleKey;

    if (
      !appId ||
      !appSecret ||
      !redirectUri ||
      !pageId ||
      !supabaseUrl ||
      !supabaseServiceRoleKey ||
      !stateSecret
    ) {
      console.error(
        "Missing environment variables:",
        {
          META_APP_ID:
            !!appId,

          META_APP_SECRET:
            !!appSecret,

          META_REDIRECT_URI:
            !!redirectUri,

          META_PAGE_ID:
            !!pageId,

          NEXT_PUBLIC_SUPABASE_URL:
            !!supabaseUrl,

          SUPABASE_SERVICE_ROLE_KEY:
            !!supabaseServiceRoleKey,

          INSTAGRAM_OAUTH_STATE_SECRET:
            !!stateSecret,
        },
      );

      return NextResponse.redirect(
        new URL(
          "/settings?error=missing_environment_variables",
          request.url,
        ),
      );
    }

    const stateData =
      readState(
        state,
        stateSecret,
      );

    if (!stateData) {
      return NextResponse.redirect(
        new URL(
          "/settings?error=invalid_oauth_state",
          request.url,
        ),
      );
    }

    const userId =
      stateData.userId;

    const tokenUrl =
      new URL(
        `https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`,
      );

    tokenUrl.searchParams.set(
      "client_id",
      appId,
    );

    tokenUrl.searchParams.set(
      "client_secret",
      appSecret,
    );

    tokenUrl.searchParams.set(
      "redirect_uri",
      redirectUri,
    );

    tokenUrl.searchParams.set(
      "code",
      code,
    );

    const tokenResponse =
      await fetch(
        tokenUrl.toString(),
        {
          method: "GET",
          cache: "no-store",
        },
      );

    const tokenData =
      await tokenResponse.json();

    if (
      !tokenResponse.ok ||
      !tokenData.access_token
    ) {
      console.error(
        "Meta token exchange failed:",
        tokenData,
      );

      return NextResponse.redirect(
        new URL(
          "/settings?error=token_exchange_failed",
          request.url,
        ),
      );
    }

    const userAccessToken =
      tokenData.access_token as string;

    const userUrl =
      new URL(
        `https://graph.facebook.com/${GRAPH_VERSION}/me`,
      );

    userUrl.searchParams.set(
      "fields",
      "id,name",
    );

    userUrl.searchParams.set(
      "access_token",
      userAccessToken,
    );

    const userResponse =
      await fetch(
        userUrl.toString(),
        {
          cache: "no-store",
        },
      );

    const userData =
      await userResponse.json();

    console.log(
      "META USER:",
      userData,
    );

    const permissionsUrl =
      new URL(
        `https://graph.facebook.com/${GRAPH_VERSION}/me/permissions`,
      );

    permissionsUrl.searchParams.set(
      "access_token",
      userAccessToken,
    );

    const permissionsResponse =
      await fetch(
        permissionsUrl.toString(),
        {
          cache: "no-store",
        },
      );

    const permissionsData =
      await permissionsResponse.json();

    console.log(
      "META PERMISSIONS:",
      permissionsData,
    );

    const pageUrl =
      new URL(
        `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}`,
      );

    pageUrl.searchParams.set(
      "fields",
      "id,name,access_token,instagram_business_account",
    );

    pageUrl.searchParams.set(
      "access_token",
      userAccessToken,
    );

    const pageResponse =
      await fetch(
        pageUrl.toString(),
        {
          cache: "no-store",
        },
      );

    const pageData =
      await pageResponse.json();

    console.log(
      "META PAGE:",
      pageData,
    );

    if (
      !pageResponse.ok ||
      pageData.error
    ) {
      console.error(
        "Meta could not access specific Page:",
        pageData,
      );

      return NextResponse.redirect(
        new URL(
          "/settings?error=page_access_failed",
          request.url,
        ),
      );
    }

    const pageAccessToken =
      pageData.access_token;

    const instagramBusinessAccount =
      pageData
        .instagram_business_account;

    if (!pageAccessToken) {
      console.error(
        "Meta returned Page but no Page Access Token:",
        pageData,
      );

      return NextResponse.redirect(
        new URL(
          "/settings?error=missing_page_access_token",
          request.url,
        ),
      );
    }

    if (
      !instagramBusinessAccount?.id
    ) {
      console.error(
        "Facebook Page has no linked Instagram professional account:",
        pageData,
      );

      return NextResponse.redirect(
        new URL(
          "/settings?error=no_linked_instagram_account",
          request.url,
        ),
      );
    }

    const instagramUserId =
      instagramBusinessAccount.id as string;

    const instagramUrl =
      new URL(
        `https://graph.facebook.com/${GRAPH_VERSION}/${instagramUserId}`,
      );

    instagramUrl.searchParams.set(
      "fields",
      "id,username,name,profile_picture_url",
    );

    instagramUrl.searchParams.set(
      "access_token",
      pageAccessToken,
    );

    const instagramResponse =
      await fetch(
        instagramUrl.toString(),
        {
          cache: "no-store",
        },
      );

    const instagramData =
      await instagramResponse.json();

    console.log(
      "INSTAGRAM ACCOUNT:",
      instagramData,
    );

    if (
      !instagramResponse.ok ||
      instagramData.error ||
      !instagramData.id
    ) {
      console.error(
        "Failed to retrieve Instagram account:",
        instagramData,
      );

      return NextResponse.redirect(
        new URL(
          "/settings?error=instagram_profile_failed",
          request.url,
        ),
      );
    }

    const supabase =
      createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            persistSession:
              false,

            autoRefreshToken:
              false,
          },
        },
      );

    const connection = {
      user_id:
        userId,

      instagram_user_id:
        instagramData.id,

      username:
        instagramData.username ||
        "Instagram",

      access_token:
        pageAccessToken,

      token_expires_at:
        tokenData.expires_in
          ? new Date(
              Date.now() +
                Number(
                  tokenData.expires_in,
                ) *
                  1000,
            ).toISOString()
          : null,
    };

    const {
      data: existingConnection,
      error: existingConnectionError,
    } =
      await supabase
        .from(
          "instagram_connections",
        )
        .select("id")
        .eq(
          "user_id",
          userId,
        )
        .limit(1)
        .maybeSingle();

    if (
      existingConnectionError
    ) {
      console.error(
        "SUPABASE INSTAGRAM LOOKUP ERROR:",
        existingConnectionError,
      );

      return NextResponse.redirect(
        new URL(
          "/settings?error=instagram_connection_lookup_failed",
          request.url,
        ),
      );
    }

    let supabaseError = null;

    if (existingConnection) {
      const {
        error: updateError,
      } =
        await supabase
          .from(
            "instagram_connections",
          )
          .update(connection)
          .eq(
            "id",
            existingConnection.id,
          )
          .eq(
            "user_id",
            userId,
          );

      supabaseError =
        updateError;
    } else {
      const {
        error: insertError,
      } =
        await supabase
          .from(
            "instagram_connections",
          )
          .insert(connection);

      supabaseError =
        insertError;
    }

    if (supabaseError) {
      console.error(
        "SUPABASE INSTAGRAM SAVE ERROR:",
        supabaseError,
      );

      return NextResponse.redirect(
        new URL(
          `/settings?error=${encodeURIComponent(
            `supabase_${
              supabaseError.code ||
              "save_failed"
            }`,
          )}`,
          request.url,
        ),
      );
    }

    console.log(
      "INSTAGRAM CONNECTION SAVED:",
      {
        user_id:
          userId,

        instagram_user_id:
          instagramData.id,

        username:
          instagramData.username,

        facebook_page_id:
          pageData.id,

        facebook_page_name:
          pageData.name,
      },
    );

    return NextResponse.redirect(
      new URL(
        `/settings?instagram=connected&username=${encodeURIComponent(
          instagramData.username ||
            "",
        )}`,
        request.url,
      ),
    );
  } catch (error) {
    console.error(
      "Instagram callback unexpected error:",
      error,
    );

    return NextResponse.redirect(
      new URL(
        "/settings?error=instagram_callback_failed",
        request.url,
      ),
    );
  }
}