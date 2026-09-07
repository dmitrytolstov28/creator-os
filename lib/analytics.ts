import { supabase } from "@/lib/supabase";

export type Video = {
  id: number;

  user_id?: string;

  title: string;

  platform: string;

  thumbnail_url?: string | null;

  post_url?: string | null;

  views: number;

  likes: number;

  comments: number;

  shares: number;

  saves: number;

  followers_gained: number;

  created_at: string;

  date_posted?: string | null;

  topic?: string | null;

  content_type?: string | null;
};

export async function getVideos() {
  /*
   * Always resolve the authenticated CreatorOS user
   * before reading video data.
   *
   * This prevents one user from seeing another
   * CreatorOS user's Instagram content.
   */
  const {
    data: userData,
    error: userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !userData.user
  ) {
    if (userError) {
      console.error(
        "VIDEO AUTH ERROR:",
        userError,
      );
    }

    throw new Error(
      "You must be logged in to load videos.",
    );
  }

  const userId =
    userData.user.id;

  /*
   * IMPORTANT:
   * Videos must always be scoped to the
   * authenticated CreatorOS user.
   */
  const {
    data,
    error,
  } =
    await supabase
      .from("videos")
      .select("*")
      .eq(
        "user_id",
        userId,
      )
      .order(
        "date_posted",
        {
          ascending: false,
          nullsFirst: false,
        },
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      );

  if (error) {
    console.error(
      "VIDEO LOAD ERROR:",
      error,
    );

    throw error;
  }

  return (
    data ?? []
  ) as Video[];
}

export function calculateTotals(
  videos: Video[],
) {
  return {
    videos:
      videos.length,

    views:
      videos.reduce(
        (
          sum,
          video,
        ) =>
          sum +
          (video.views ??
            0),
        0,
      ),

    likes:
      videos.reduce(
        (
          sum,
          video,
        ) =>
          sum +
          (video.likes ??
            0),
        0,
      ),

    comments:
      videos.reduce(
        (
          sum,
          video,
        ) =>
          sum +
          (video.comments ??
            0),
        0,
      ),

    shares:
      videos.reduce(
        (
          sum,
          video,
        ) =>
          sum +
          (video.shares ??
            0),
        0,
      ),

    saves:
      videos.reduce(
        (
          sum,
          video,
        ) =>
          sum +
          (video.saves ??
            0),
        0,
      ),

    followers:
      videos.reduce(
        (
          sum,
          video,
        ) =>
          sum +
          (video.followers_gained ??
            0),
        0,
      ),
  };
}

export function getAverageViews(
  videos: Video[],
) {
  if (
    !videos.length
  ) {
    return 0;
  }

  const totals =
    calculateTotals(
      videos,
    );

  return Math.round(
    totals.views /
      videos.length,
  );
}

export function getBestVideo(
  videos: Video[],
) {
  return [
    ...videos,
  ].sort(
    (
      a,
      b,
    ) =>
      (b.views ?? 0) -
      (a.views ?? 0),
  )[0];
}

export function getBestPlatform(
  videos: Video[],
) {
  const platforms: Record<
    string,
    number
  > = {};

  videos.forEach(
    (video) => {
      platforms[
        video.platform
      ] =
        (platforms[
          video.platform
        ] || 0) +
        (video.views ??
          0);
    },
  );

  return Object.entries(
    platforms,
  ).sort(
    (
      a,
      b,
    ) =>
      b[1] -
      a[1],
  )[0];
}

export function getEngagementRate(
  videos: Video[],
) {
  const totals =
    calculateTotals(
      videos,
    );

  if (
    !totals.views
  ) {
    return 0;
  }

  return Number(
    (
      ((totals.likes +
        totals.comments +
        totals.shares) /
        totals.views) *
      100
    ).toFixed(1),
  );
}