import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function createState(
  userId: string,
  secret: string,
) {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      expiresAt:
        Date.now() + 10 * 60 * 1000,
    }),
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export async function POST(
  request: Request,
) {
  const appId =
    process.env.META_APP_ID;

  const redirectUri =
    process.env.META_REDIRECT_URI;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  const stateSecret =
    process.env.INSTAGRAM_OAUTH_STATE_SECRET ||
    serviceRoleKey;

  if (
    !appId ||
    !redirectUri ||
    !supabaseUrl ||
    !serviceRoleKey ||
    !stateSecret
  ) {
    return NextResponse.json(
      {
        error:
          "Missing server environment variables.",
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
          "You must be logged in to connect Instagram.",
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
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

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
      "INSTAGRAM OAUTH AUTH ERROR:",
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

  const scopes = [
    "instagram_basic",
    "instagram_manage_insights",
    "pages_show_list",
    "pages_read_engagement",
  ];

  const state =
    createState(
      userData.user.id,
      stateSecret,
    );

  const authUrl =
    `https://www.facebook.com/v23.0/dialog/oauth` +
    `?client_id=${encodeURIComponent(appId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes.join(","))}` +
    `&response_type=code` +
    `&state=${encodeURIComponent(state)}`;

  return NextResponse.json({
    authUrl,
  });
}