"use client";

import {
  useEffect,
  useState,
} from "react";

import AppShell from "../../components/layout/AppShell";

import { supabase } from "@/lib/supabase";

import { toast } from "sonner";

import {
  User,
  Palette,
  Bell,
  Shield,
  Database,
  Cpu,
  Link as LinkIcon,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

function InstagramIcon({
  size = 24,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
      />
    </svg>
  );
}

type InstagramConnection = {
  id: string;
  instagram_user_id: string;
  username: string;
  created_at: string;
};

type SyncResponse = {
  success: boolean;
  username?: string;
  totalMedia?: number;
  videosFound?: number;
  inserted?: number;
  updated?: number;
  skipped?: number;
  error?: string;
};

const systems = [
  {
    title: "Creator Profile",
    description:
      "Manage creator identity and account information.",
    icon: User,
    status: "Identity Layer",
  },

  {
    title: "Interface Settings",
    description:
      "Customize your CreatorOS environment.",
    icon: Palette,
    status: "Visual Engine",
  },

  {
    title: "Notification Center",
    description:
      "Control alerts and system updates.",
    icon: Bell,
    status: "Signal Manager",
  },

  {
    title: "Security Layer",
    description:
      "Manage account protection settings.",
    icon: Shield,
    status: "Protection Core",
  },

  {
    title: "Data Management",
    description:
      "Control connected creator data.",
    icon: Database,
    status: "Data Infrastructure",
  },
];

export default function SettingsPage() {
  const [
    instagramConnection,
    setInstagramConnection,
  ] =
    useState<InstagramConnection | null>(
      null,
    );

  const [
    loadingInstagram,
    setLoadingInstagram,
  ] = useState(true);

  const [
    syncingInstagram,
    setSyncingInstagram,
  ] = useState(false);

  const [
    instagramError,
    setInstagramError,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    loadInstagramConnection();
  }, []);

  async function loadInstagramConnection() {
    try {
      setLoadingInstagram(true);
      setInstagramError(null);

      const {
        data,
        error,
      } = await supabase
        .from(
          "instagram_connections",
        )
        .select(
          `
          id,
          instagram_user_id,
          username,
          created_at
          `,
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setInstagramConnection(
        data as InstagramConnection | null,
      );
    } catch (error) {
      console.error(
        "Failed to load Instagram connection:",
        error,
      );

      setInstagramError(
        "Unable to check Instagram connection.",
      );
    } finally {
      setLoadingInstagram(false);
    }
  }

  async function syncInstagram() {
    if (syncingInstagram) {
      return;
    }

    try {
      setSyncingInstagram(true);

      toast.loading(
        "Syncing Instagram...",
        {
          id: "instagram-sync",
        },
      );

      const response = await fetch(
        "/api/instagram/sync",
        {
          method: "POST",
        },
      );

      const data =
        (await response.json()) as SyncResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Instagram sync failed.",
        );
      }

      toast.success(
        "Instagram synced",
        {
          id: "instagram-sync",

          description: `${data.inserted ?? 0} new · ${data.updated ?? 0} updated`,
        },
      );
    } catch (error) {
      console.error(
        "Instagram sync failed:",
        error,
      );

      toast.error(
        "Instagram sync failed",
        {
          id: "instagram-sync",

          description:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
        },
      );
    } finally {
      setSyncingInstagram(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-10">
        <div>
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Cpu
              size={18}
              className="text-emerald-400"
            />

            <p
              className="
                text-xs
                uppercase
                tracking-[0.35em]
                text-emerald-400/70
              "
            >
              System Settings
            </p>
          </div>

          <h1
            className="
              mt-4
              text-5xl
              font-bold
              text-white
            "
          >
            Settings
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your CreatorOS
            preferences and account
            settings.
          </p>
        </div>

        <div
          className="
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {/* Instagram Integration */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-emerald-400/20
              bg-white/[0.04]
              p-6
              backdrop-blur-xl
              transition-all
              hover:border-emerald-400/50
              hover:shadow-[0_0_35px_rgba(0,255,136,0.12)]
            "
          >
            <div
              className="
                absolute
                -right-16
                -top-16
                h-40
                w-40
                rounded-full
                bg-emerald-400/10
                blur-3xl
                opacity-0
                transition
                group-hover:opacity-100
              "
            />

            <div className="relative">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-400/30
                  bg-emerald-400/10
                  text-emerald-400
                "
              >
                <InstagramIcon
                  size={24}
                />
              </div>

              <h2
                className="
                  mt-6
                  text-xl
                  font-semibold
                  text-white
                "
              >
                Instagram Integration
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  text-zinc-400
                "
              >
                Connect your Creator
                account and sync Reels
                analytics automatically.
              </p>

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-between
                  border-t
                  border-emerald-400/10
                  pt-4
                "
              >
                <span
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-zinc-500
                  "
                >
                  Social Data Layer
                </span>

                {loadingInstagram ? (
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-xs
                      text-zinc-400
                    "
                  >
                    <RefreshCw
                      size={13}
                      className="animate-spin"
                    />

                    Checking
                  </div>
                ) : instagramConnection ? (
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-xs
                      text-emerald-400
                    "
                  >
                    <div
                      className="
                        h-2
                        w-2
                        rounded-full
                        bg-emerald-400
                        shadow-[0_0_8px_rgba(52,211,153,0.8)]
                      "
                    />

                    Connected
                  </div>
                ) : (
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-xs
                      text-yellow-400
                    "
                  >
                    <div
                      className="
                        h-2
                        w-2
                        rounded-full
                        bg-yellow-400
                      "
                    />

                    Not Connected
                  </div>
                )}
              </div>

              {instagramConnection && (
                <div
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-emerald-400/20
                    bg-emerald-400/[0.06]
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-emerald-400/10
                        text-emerald-400
                      "
                    >
                      <CheckCircle2
                        size={18}
                      />
                    </div>

                    <div>
                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-wider
                          text-zinc-500
                        "
                      >
                        Connected Account
                      </p>

                      <p
                        className="
                          mt-1
                          font-semibold
                          text-white
                        "
                      >
                        @
                        {
                          instagramConnection.username
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {instagramError && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-400/[0.06]
                    px-4
                    py-3
                    text-sm
                    text-red-300
                  "
                >
                  {instagramError}
                </div>
              )}

              {instagramConnection ? (
                <div
                  className="
                    mt-6
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
                  <button
                    type="button"
                    onClick={
                      syncInstagram
                    }
                    disabled={
                      syncingInstagram
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-emerald-400
                      px-4
                      py-3
                      font-semibold
                      text-black
                      transition
                      hover:bg-emerald-300
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <RefreshCw
                      size={18}
                      className={
                        syncingInstagram
                          ? "animate-spin"
                          : ""
                      }
                    />

                    {syncingInstagram
                      ? "Syncing..."
                      : "Sync Instagram"}
                  </button>

                  <a
                    href="/api/auth/instagram"
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-emerald-400/30
                      bg-emerald-400/[0.06]
                      px-4
                      py-3
                      font-semibold
                      text-emerald-300
                      transition
                      hover:border-emerald-400/60
                      hover:bg-emerald-400/[0.1]
                    "
                  >
                    <LinkIcon
                      size={18}
                    />

                    Reconnect
                  </a>
                </div>
              ) : (
                <a
                  href="/api/auth/instagram"
                  className="
                    mt-6
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-emerald-400
                    px-4
                    py-3
                    font-semibold
                    text-black
                    transition
                    hover:bg-emerald-300
                  "
                >
                  <LinkIcon
                    size={18}
                  />

                  Connect Instagram
                </a>
              )}
            </div>
          </div>

          {systems.map(
            (system) => (
              <div
                key={
                  system.title
                }
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-emerald-400/20
                  bg-white/[0.04]
                  p-6
                  backdrop-blur-xl
                  transition-all
                  hover:border-emerald-400/50
                  hover:shadow-[0_0_35px_rgba(0,255,136,0.12)]
                "
              >
                <div
                  className="
                    absolute
                    -right-16
                    -top-16
                    h-40
                    w-40
                    rounded-full
                    bg-emerald-400/10
                    blur-3xl
                    opacity-0
                    transition
                    group-hover:opacity-100
                  "
                />

                <div className="relative">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-emerald-400/30
                      bg-emerald-400/10
                    "
                  >
                    <system.icon
                      size={24}
                      className="text-emerald-400"
                    />
                  </div>

                  <h2
                    className="
                      mt-6
                      text-xl
                      font-semibold
                      text-white
                    "
                  >
                    {
                      system.title
                    }
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-zinc-400
                    "
                  >
                    {
                      system.description
                    }
                  </p>

                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      justify-between
                      border-t
                      border-emerald-400/10
                      pt-4
                    "
                  >
                    <span
                      className="
                        text-xs
                        uppercase
                        tracking-wider
                        text-zinc-500
                      "
                    >
                      {
                        system.status
                      }
                    </span>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-emerald-400
                      "
                    >
                      <div
                        className="
                          h-2
                          w-2
                          rounded-full
                          bg-emerald-400
                        "
                      />

                      Online
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </AppShell>
  );
}