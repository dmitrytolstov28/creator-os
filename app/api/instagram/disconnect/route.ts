import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

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
          success: false,
          error:
            "You must be logged in to disconnect Instagram.",
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
        "INSTAGRAM DISCONNECT AUTH ERROR:",
        userError,
      );

      return NextResponse.json(
        {
          success: false,
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
      error: deleteError,
    } =
      await supabase
        .from(
          "instagram_connections",
        )
        .delete()
        .eq(
          "user_id",
          userId,
        );

    if (deleteError) {
      console.error(
        "INSTAGRAM DISCONNECT DELETE ERROR:",
        deleteError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Could not disconnect Instagram.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "INSTAGRAM DISCONNECT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not disconnect Instagram.",
      },
      {
        status: 500,
      },
    );
  }
}