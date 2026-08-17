import { NextResponse } from "next/server";

export async function GET() {
  const appId = process.env.META_APP_ID;
  const redirectUri = process.env.META_REDIRECT_URI;

  if (!appId || !redirectUri) {
    return NextResponse.json(
      {
        error: "Missing Meta environment variables",
      },
      {
        status: 500,
      },
    );
  }

  const scopes = [
    "instagram_basic",
    "instagram_manage_insights",
    "pages_show_list",
    "pages_read_engagement",
  ];

  const authUrl =
    `https://www.facebook.com/v23.0/dialog/oauth` +
    `?client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes.join(","))}` +
    `&response_type=code`;

  return NextResponse.redirect(authUrl);
}