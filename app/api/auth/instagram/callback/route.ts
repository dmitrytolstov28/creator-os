import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const GRAPH_VERSION = "v23.0";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      console.error("Instagram OAuth error:", {
        error,
        errorDescription,
      });

      return NextResponse.redirect(
        new URL(
          `/settings?error=${encodeURIComponent(
            errorDescription || error,
          )}`,
          request.url,
        ),
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/settings?error=missing_code", request.url),
      );
    }

    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI;
    const pageId = process.env.META_PAGE_ID;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !appId ||
      !appSecret ||
      !redirectUri ||
      !pageId ||
      !supabaseUrl ||
      !supabaseServiceRoleKey
    ) {
      console.error("Missing environment variables:", {
        META_APP_ID: !!appId,
        META_APP_SECRET: !!appSecret,
        META_REDIRECT_URI: !!redirectUri,
        META_PAGE_ID: !!pageId,
        NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceRoleKey,
      });

      return NextResponse.redirect(
        new URL("/settings?error=missing_environment_variables", request.url),
      );
    }

    /*
     * STEP 1
     * Exchange Facebook OAuth code for a User Access Token.
     */
    const tokenUrl = new URL(
      `https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`,
    );

    tokenUrl.searchParams.set("client_id", appId);
    tokenUrl.searchParams.set("client_secret", appSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const tokenResponse = await fetch(tokenUrl.toString(), {
      method: "GET",
      cache: "no-store",
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Meta token exchange failed:", tokenData);

      return NextResponse.redirect(
        new URL("/settings?error=token_exchange_failed", request.url),
      );
    }

    const userAccessToken = tokenData.access_token as string;

    /*
     * STEP 2
     * Confirm which Facebook account authorized CreatorOS.
     */
    const userUrl = new URL(
      `https://graph.facebook.com/${GRAPH_VERSION}/me`,
    );

    userUrl.searchParams.set("fields", "id,name");
    userUrl.searchParams.set("access_token", userAccessToken);

    const userResponse = await fetch(userUrl.toString(), {
      cache: "no-store",
    });

    const userData = await userResponse.json();

    console.log("META USER:", userData);

    /*
     * STEP 3
     * Check permissions Meta actually granted.
     */
    const permissionsUrl = new URL(
      `https://graph.facebook.com/${GRAPH_VERSION}/me/permissions`,
    );

    permissionsUrl.searchParams.set(
      "access_token",
      userAccessToken,
    );

    const permissionsResponse = await fetch(
      permissionsUrl.toString(),
      {
        cache: "no-store",
      },
    );

    const permissionsData =
      await permissionsResponse.json();

    console.log("META PERMISSIONS:", permissionsData);

    /*
     * STEP 4
     * IMPORTANT:
     *
     * We no longer use /me/accounts.
     *
     * We already know the exact Facebook Page ID,
     * so we ask Meta for that Page directly.
     *
     * Meta's Instagram API documentation supports:
     *
     * /{page_id}
     * ?fields=name,access_token,instagram_business_account
     */
    const pageUrl = new URL(
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

    const pageResponse = await fetch(pageUrl.toString(), {
      cache: "no-store",
    });

    const pageData = await pageResponse.json();

    console.log("META PAGE:", pageData);

    if (!pageResponse.ok || pageData.error) {
      console.error(
        "Meta could not access specific Page:",
        pageData,
      );

      return NextResponse.redirect(
        new URL("/settings?error=page_access_failed", request.url),
      );
    }

    const pageAccessToken = pageData.access_token;
    const instagramBusinessAccount =
      pageData.instagram_business_account;

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

    if (!instagramBusinessAccount?.id) {
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

    /*
     * STEP 5
     * Get the Instagram professional account.
     */
    const instagramUrl = new URL(
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

    const instagramResponse = await fetch(
      instagramUrl.toString(),
      {
        cache: "no-store",
      },
    );

    const instagramData =
      await instagramResponse.json();

    console.log("INSTAGRAM ACCOUNT:", instagramData);

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

    /*
     * STEP 6
     * Save connection in Supabase.
     *
     * IMPORTANT:
     * We save the PAGE ACCESS TOKEN because Instagram API
     * with Facebook Login uses a Facebook Page access token.
     */
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const connection = {
      instagram_user_id: instagramData.id,
      username:
        instagramData.username || "Instagram",
      access_token: pageAccessToken,
      token_expires_at: tokenData.expires_in
        ? new Date(
            Date.now() +
              Number(tokenData.expires_in) * 1000,
          ).toISOString()
        : null,
    };

    const { error: supabaseError } = await supabase
      .from("instagram_connections")
      .upsert(connection, {
        onConflict: "instagram_user_id",
      });

    if (supabaseError) {
      console.error(
        "SUPABASE INSTAGRAM SAVE ERROR:",
        supabaseError,
      );

      return NextResponse.redirect(
        new URL(
          `/settings?error=${encodeURIComponent(
            `supabase_${supabaseError.code || "save_failed"}`,
          )}`,
          request.url,
        ),
      );
    }

    console.log("INSTAGRAM CONNECTION SAVED:", {
      instagram_user_id: instagramData.id,
      username: instagramData.username,
      facebook_page_id: pageData.id,
      facebook_page_name: pageData.name,
    });

    return NextResponse.redirect(
      new URL(
        `/settings?instagram=connected&username=${encodeURIComponent(
          instagramData.username || "",
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