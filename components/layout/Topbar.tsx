"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  Activity,
  BarChart3,
  Bell,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  CheckCheck,
  ChevronDown,
  CircleUserRound,
  Clock3,
  LayoutDashboard,
  Lightbulb,
  Loader2,
  LogOut,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  UserCircle2,
  Video,
  X,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  supabase,
} from "@/lib/supabase";

import {
  useAuth,
} from "@/components/auth/AuthProvider";

import {
  getNotificationPreferences,
  NOTIFICATION_PREFERENCES_KEY,
  PREFERENCES_UPDATED_EVENT,
  type NotificationPreferences,
} from "@/lib/preferences";

import {
  clearNotifications,
  createNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NOTIFICATIONS_UPDATED_EVENT,
  type CreatorNotification,
  type NotificationCategory,
} from "@/lib/notifications";

type OpenPanel =
  | "create"
  | "search"
  | "notifications"
  | "profile"
  | null;

type InstagramConnection = {
  id: string;
  username: string;
};

const searchItems = [
  {
    title: "Dashboard",
    description:
      "View your CreatorOS overview and performance.",
    href: "/",
    icon: LayoutDashboard,
    keywords:
      "dashboard home overview performance",
  },

  {
    title: "Calendar",
    description:
      "View your published content by date.",
    href: "/calendar",
    icon: CalendarDays,
    keywords:
      "calendar dates posts published schedule",
  },

  {
    title: "Videos",
    description:
      "Browse your synced Instagram content.",
    href: "/videos",
    icon: Video,
    keywords:
      "videos reels posts instagram content",
  },

  {
    title: "Ideas",
    description:
      "Generate AI-powered content ideas.",
    href: "/ideas",
    icon: Lightbulb,
    keywords:
      "ideas ai generate content recommendations",
  },

  {
    title: "Analytics",
    description:
      "Analyze content performance and metrics.",
    href: "/analytics",
    icon: BarChart3,
    keywords:
      "analytics metrics views likes saves shares engagement",
  },

  {
    title: "AI Assistant",
    description:
      "Ask CreatorOS about your performance.",
    href: "/intelligence",
    icon: Brain,
    keywords:
      "assistant ai intelligence insights analysis questions",
  },

  {
    title: "Settings",
    description:
      "Manage your account and integrations.",
    href: "/settings",
    icon: Settings,
    keywords:
      "settings account instagram profile security notifications",
  },
];

function categoryEnabled(
  preferences: NotificationPreferences,
  category: NotificationCategory,
) {
  switch (category) {
    case "instagram":
      return preferences.instagram;

    case "ai":
      return preferences.ai;

    case "security":
      return preferences.security;

    case "system":
      return preferences.system;

    default:
      return false;
  }
}

function getCategoryLabel(
  category: NotificationCategory,
) {
  switch (category) {
    case "instagram":
      return "Instagram";

    case "ai":
      return "AI";

    case "security":
      return "Security";

    case "system":
      return "System";
  }
}

function getRelativeTime(
  value: string,
) {
  const timestamp =
    new Date(
      value,
    ).getTime();

  if (
    Number.isNaN(
      timestamp,
    )
  ) {
    return "";
  }

  const difference =
    Date.now() -
    timestamp;

  const seconds =
    Math.max(
      0,
      Math.floor(
        difference /
          1000,
      ),
    );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes =
    Math.floor(
      seconds /
        60,
    );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes /
        60,
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours /
        24,
    );

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(
    value,
  ).toLocaleDateString();
}

export default function Topbar() {
  const [
    openPanel,
    setOpenPanel,
  ] =
    useState<OpenPanel>(
      null,
    );

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState("");

  const [
    loggingOut,
    setLoggingOut,
  ] =
    useState(false);

  const [
    loadingNotifications,
    setLoadingNotifications,
  ] =
    useState(false);

  const [
    instagramConnection,
    setInstagramConnection,
  ] =
    useState<InstagramConnection | null>(
      null,
    );

  const [
    notifications,
    setNotifications,
  ] =
    useState<CreatorNotification[]>(
      [],
    );

  const [
    notificationPreferences,
    setNotificationPreferences,
  ] =
    useState<NotificationPreferences>(
      {
        instagram: true,
        ai: true,
        security: true,
        system: true,
      },
    );

  const [
    profileExpanded,
    setProfileExpanded,
  ] =
    useState(false);

  const router =
    useRouter();

  const {
    user,
  } =
    useAuth();

  const displayName =
    typeof user
      ?.user_metadata
      ?.display_name ===
      "string" &&
    user.user_metadata
      .display_name
      .trim()
      ? user.user_metadata
          .display_name
          .trim()
      : user?.email
        ? user.email.split(
            "@",
          )[0]
        : "Creator";

  const filteredSearchItems =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return searchItems;
      }

      return searchItems.filter(
        (item) => {
          const searchable =
            `${item.title} ${item.description} ${item.keywords}`.toLowerCase();

          return searchable.includes(
            query,
          );
        },
      );
    }, [
      searchQuery,
    ]);

  const visibleNotifications =
    useMemo(
      () =>
        notifications.filter(
          (
            notification,
          ) =>
            categoryEnabled(
              notificationPreferences,
              notification.category,
            ),
        ),
      [
        notifications,
        notificationPreferences,
      ],
    );

  const unreadCount =
    useMemo(
      () =>
        visibleNotifications.filter(
          (
            notification,
          ) =>
            !notification.read,
        ).length,
      [
        visibleNotifications,
      ],
    );

  function refreshNotificationState() {
    setNotifications(
      getNotifications(),
    );

    setNotificationPreferences(
      getNotificationPreferences(),
    );
  }

  useEffect(() => {
    refreshNotificationState();

    function handleNotificationUpdate() {
      refreshNotificationState();
    }

    function handlePreferenceUpdate() {
      refreshNotificationState();
    }

    function handleStorage(
      event: StorageEvent,
    ) {
      if (
        event.key ===
          NOTIFICATION_PREFERENCES_KEY ||
        event.key ===
          "creatoros-notifications" ||
        event.key === null
      ) {
        refreshNotificationState();
      }
    }

    window.addEventListener(
      NOTIFICATIONS_UPDATED_EVENT,
      handleNotificationUpdate,
    );

    window.addEventListener(
      PREFERENCES_UPDATED_EVENT,
      handlePreferenceUpdate,
    );

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        NOTIFICATIONS_UPDATED_EVENT,
        handleNotificationUpdate,
      );

      window.removeEventListener(
        PREFERENCES_UPDATED_EVENT,
        handlePreferenceUpdate,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, []);

  useEffect(() => {
    if (
      openPanel !==
      "notifications"
    ) {
      return;
    }

    void loadNotificationData();
  }, [
    openPanel,
  ]);

  function togglePanel(
    panel: OpenPanel,
  ) {
    setOpenPanel(
      openPanel === panel
        ? null
        : panel,
    );

    if (
      panel !==
      "search"
    ) {
      setSearchQuery("");
    }

    if (
      panel !==
      "profile"
    ) {
      setProfileExpanded(
        false,
      );
    }
  }

  function closePanels() {
    setOpenPanel(
      null,
    );

    setSearchQuery(
      "",
    );

    setProfileExpanded(
      false,
    );
  }

  function navigateTo(
    href: string,
  ) {
    closePanels();

    router.push(
      href,
    );
  }

  async function loadNotificationData() {
    try {
      setLoadingNotifications(
        true,
      );

      const {
        data,
        error,
      } =
        await supabase
          .from(
            "instagram_connections",
          )
          .select(
            "id, username",
          )
          .limit(1)
          .maybeSingle();

      if (error) {
        throw error;
      }

      const connection =
        data as InstagramConnection | null;

      setInstagramConnection(
        connection,
      );

      if (connection) {
        createNotification({
          category:
            "instagram",

          title:
            "Instagram connected",

          message:
            `@${connection.username} is connected to CreatorOS.`,

          href:
            "/settings",

          dedupeKey:
            "instagram-connection-status",
        });
      } else {
        createNotification({
          category:
            "instagram",

          title:
            "Instagram not connected",

          message:
            "Connect Instagram to unlock synced analytics and AI features.",

          href:
            "/settings",

          dedupeKey:
            "instagram-connection-status",
        });
      }

      refreshNotificationState();
    } catch (error) {
      console.error(
        "NOTIFICATION DATA ERROR:",
        error,
      );

      setInstagramConnection(
        null,
      );

      createNotification({
        category:
          "system",

        title:
          "Connection check failed",

        message:
          "CreatorOS could not verify your Instagram connection status.",

        href:
          "/settings",

        dedupeKey:
          "instagram-connection-check-error",
      });

      refreshNotificationState();
    } finally {
      setLoadingNotifications(
        false,
      );
    }
  }

  function openNotification(
    notification: CreatorNotification,
  ) {
    if (
      !notification.read
    ) {
      markNotificationRead(
        notification.id,
      );
    }

    if (
      notification.href
    ) {
      navigateTo(
        notification.href,
      );
    }
  }

  function handleMarkAllRead() {
    markAllNotificationsRead();

    refreshNotificationState();
  }

  function handleClearNotifications() {
    clearNotifications();

    refreshNotificationState();
  }

  async function handleLogout() {
    if (
      loggingOut
    ) {
      return;
    }

    setLoggingOut(
      true,
    );

    try {
      const {
        error,
      } =
        await supabase.auth.signOut();

      if (error) {
        toast.error(
          "Could not log out. Please try again.",
        );

        return;
      }

      closePanels();

      toast.success(
        "Logged out successfully.",
      );

      router.replace(
        "/auth",
      );

      router.refresh();
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error,
      );

      toast.error(
        "Could not log out. Please try again.",
      );
    } finally {
      setLoggingOut(
        false,
      );
    }
  }

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-50
          flex
          items-center
          justify-between
          border-b
          border-emerald-400/10
          bg-black/30
          px-8
          py-5
          backdrop-blur-xl
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-emerald-400/30
              bg-emerald-400/10
            "
          >
            <Activity
              size={20}
              className="text-emerald-400"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/70">
              CreatorOS
            </p>

            <h2 className="text-lg font-semibold text-white">
              Command Center
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              togglePanel(
                "create",
              )
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-emerald-400
              px-4
              py-2.5
              font-semibold
              text-black
              transition
              hover:bg-emerald-300
            "
          >
            {openPanel ===
            "create" ? (
              <X
                size={18}
              />
            ) : (
              <Plus
                size={18}
              />
            )}

            Create
          </button>

          <button
            type="button"
            onClick={() =>
              togglePanel(
                "search",
              )
            }
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              transition
              ${
                openPanel ===
                "search"
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400"
                  : "border-emerald-400/20 bg-white/[0.04] text-zinc-400 hover:text-white"
              }
            `}
            title="Search CreatorOS"
          >
            <Search
              size={18}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              togglePanel(
                "notifications",
              )
            }
            className={`
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              transition
              ${
                openPanel ===
                "notifications"
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400"
                  : "border-emerald-400/20 bg-white/[0.04] text-zinc-400 hover:text-white"
              }
            `}
            title="Notifications"
          >
            <Bell
              size={18}
            />

            {unreadCount >
              0 && (
              <>
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

                <span className="sr-only">
                  {
                    unreadCount
                  }{" "}
                  unread notifications
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              togglePanel(
                "profile",
              )
            }
            className={`
              flex
              items-center
              gap-2
              rounded-xl
              border
              px-3
              py-2
              transition
              ${
                openPanel ===
                "profile"
                  ? "border-emerald-400/50 bg-emerald-400/10"
                  : "border-emerald-400/20 bg-white/[0.04] hover:border-emerald-400/40"
              }
            `}
          >
            <UserCircle2
              size={28}
              className="text-emerald-400"
            />

            <span className="max-w-32 truncate text-sm text-white">
              {displayName}
            </span>

            <ChevronDown
              size={14}
              className={`
                text-zinc-500
                transition
                ${
                  openPanel ===
                  "profile"
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              void handleLogout()
            }
            disabled={
              loggingOut
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-red-400/20
              bg-red-400/[0.05]
              text-zinc-400
              transition
              hover:border-red-400/40
              hover:bg-red-400/10
              hover:text-red-300
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            title="Log out"
          >
            {loggingOut ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <LogOut
                size={17}
              />
            )}
          </button>
        </div>

        {openPanel ===
          "create" && (
          <div
            className="
              absolute
              right-8
              top-[76px]
              w-72
              rounded-2xl
              border
              border-emerald-400/20
              bg-[#050807]
              p-3
              shadow-[0_0_40px_rgba(0,255,136,0.15)]
            "
          >
            <p className="px-3 pb-3 text-xs uppercase tracking-[0.25em] text-zinc-500">
              Creator Tools
            </p>

            <Link
              href="/ideas"
              onClick={
                closePanels
              }
              className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <Sparkles
                size={18}
                className="text-emerald-400"
              />

              <div>
                <p className="text-sm font-medium">
                  Generate Ideas
                </p>

                <p className="mt-0.5 text-xs text-zinc-600">
                  Create ideas from your
                  performance
                </p>
              </div>
            </Link>

            <Link
              href="/videos"
              onClick={
                closePanels
              }
              className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <Video
                size={18}
                className="text-emerald-400"
              />

              <div>
                <p className="text-sm font-medium">
                  View Content
                </p>

                <p className="mt-0.5 text-xs text-zinc-600">
                  Browse synced Instagram
                  posts
                </p>
              </div>
            </Link>

            <Link
              href="/calendar"
              onClick={
                closePanels
              }
              className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <CalendarDays
                size={18}
                className="text-emerald-400"
              />

              <div>
                <p className="text-sm font-medium">
                  View Calendar
                </p>

                <p className="mt-0.5 text-xs text-zinc-600">
                  See content by publish
                  date
                </p>
              </div>
            </Link>
          </div>
        )}

        {openPanel ===
          "search" && (
          <div
            className="
              absolute
              right-8
              top-[76px]
              w-[420px]
              overflow-hidden
              rounded-2xl
              border
              border-emerald-400/20
              bg-[#050807]
              shadow-[0_0_40px_rgba(0,255,136,0.15)]
            "
          >
            <div className="border-b border-emerald-400/10 p-4">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  autoFocus
                  type="text"
                  value={
                    searchQuery
                  }
                  onChange={(
                    event,
                  ) =>
                    setSearchQuery(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Search CreatorOS..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/30
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-emerald-400/40
                  "
                />
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-2">
              {filteredSearchItems.length >
              0 ? (
                filteredSearchItems.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    return (
                      <button
                        key={
                          item.href
                        }
                        type="button"
                        onClick={() =>
                          navigateTo(
                            item.href,
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          p-3
                          text-left
                          transition
                          hover:bg-white/5
                        "
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06]">
                          <Icon
                            size={17}
                            className="text-emerald-400"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-white">
                            {
                              item.title
                            }
                          </p>

                          <p className="mt-0.5 text-xs text-zinc-600">
                            {
                              item.description
                            }
                          </p>
                        </div>
                      </button>
                    );
                  },
                )
              ) : (
                <div className="p-8 text-center">
                  <Search
                    size={22}
                    className="mx-auto text-zinc-700"
                  />

                  <p className="mt-3 text-sm text-zinc-500">
                    No matching pages
                    found.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {openPanel ===
          "notifications" && (
          <div
            className="
              absolute
              right-8
              top-[76px]
              w-[380px]
              overflow-hidden
              rounded-2xl
              border
              border-emerald-400/20
              bg-[#050807]
              shadow-[0_0_40px_rgba(0,255,136,0.15)]
            "
          >
            <div className="flex items-center justify-between border-b border-emerald-400/10 px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <Bell
                    size={16}
                    className="text-emerald-400"
                  />

                  <p className="text-sm font-semibold text-white">
                    Notifications
                  </p>

                  {unreadCount >
                    0 && (
                    <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      {
                        unreadCount
                      } new
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-zinc-600">
                  Recent CreatorOS
                  activity
                </p>
              </div>

              <div className="flex items-center gap-1">
                {visibleNotifications.length >
                  0 &&
                  unreadCount >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        handleMarkAllRead
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-emerald-400"
                      title="Mark all as read"
                    >
                      <CheckCheck
                        size={15}
                      />
                    </button>
                  )}

                {visibleNotifications.length >
                  0 && (
                  <button
                    type="button"
                    onClick={
                      handleClearNotifications
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-400/[0.06] hover:text-red-300"
                    title="Clear notifications"
                  >
                    <Trash2
                      size={14}
                    />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[430px] overflow-y-auto p-2">
              {loadingNotifications &&
              visibleNotifications.length ===
                0 ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-zinc-500">
                  <Loader2
                    size={16}
                    className="animate-spin text-emerald-400"
                  />

                  Loading notifications...
                </div>
              ) : visibleNotifications.length >
                0 ? (
                <div className="space-y-1">
                  {visibleNotifications.map(
                    (
                      notification,
                    ) => (
                      <button
                        key={
                          notification.id
                        }
                        type="button"
                        onClick={() =>
                          openNotification(
                            notification,
                          )
                        }
                        className={`
                          relative
                          w-full
                          rounded-xl
                          border
                          p-3
                          text-left
                          transition
                          ${
                            notification.read
                              ? "border-transparent bg-transparent hover:bg-white/[0.04]"
                              : "border-emerald-400/10 bg-emerald-400/[0.05] hover:bg-emerald-400/[0.08]"
                          }
                        `}
                      >
                        {!notification.read && (
                          <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        )}

                        <div className="pr-5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400/70">
                              {getCategoryLabel(
                                notification.category,
                              )}
                            </span>

                            {notification.read && (
                              <Check
                                size={11}
                                className="text-zinc-700"
                              />
                            )}
                          </div>

                          <p className="mt-1.5 text-sm font-medium text-white">
                            {
                              notification.title
                            }
                          </p>

                          <p className="mt-1 text-xs leading-5 text-zinc-500">
                            {
                              notification.message
                            }
                          </p>

                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-700">
                            <Clock3
                              size={10}
                            />

                            {getRelativeTime(
                              notification.createdAt,
                            )}
                          </div>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <CheckCircle2
                    size={24}
                    className="mx-auto text-emerald-400/60"
                  />

                  <p className="mt-3 text-sm font-medium text-zinc-300">
                    You&apos;re all
                    caught up
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    No notifications in
                    your enabled
                    categories.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-emerald-400/10 p-2">
              <button
                type="button"
                onClick={() =>
                  navigateTo(
                    "/settings",
                  )
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
              >
                <Settings
                  size={13}
                />

                Notification Settings
              </button>
            </div>
          </div>
        )}

        {openPanel ===
          "profile" && (
          <div
            className="
              absolute
              right-8
              top-[76px]
              w-72
              rounded-2xl
              border
              border-emerald-400/20
              bg-[#050807]
              p-3
              shadow-[0_0_40px_rgba(0,255,136,0.15)]
            "
          >
            <div className="px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                  <CircleUserRound
                    size={21}
                    className="text-emerald-400"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {
                      displayName
                    }
                  </p>

                  <p className="mt-0.5 truncate text-xs text-zinc-600">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="my-2 border-t border-emerald-400/10" />

            <button
              type="button"
              onClick={() =>
                setProfileExpanded(
                  !profileExpanded,
                )
              }
              className="flex w-full items-center justify-between rounded-xl p-3 text-left text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <UserCircle2
                  size={17}
                  className="text-emerald-400"
                />

                View Profile
              </div>

              <ChevronDown
                size={14}
                className={`
                  text-zinc-600
                  transition
                  ${
                    profileExpanded
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {profileExpanded && (
              <div className="mx-2 mb-2 rounded-xl border border-emerald-400/10 bg-black/25 p-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                    Display Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    {
                      displayName
                    }
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                    Email
                  </p>

                  <p className="mt-1 break-all text-xs text-zinc-400">
                    {user?.email}
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                    Account Status
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2
                      size={13}
                    />

                    Active
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                navigateTo(
                  "/settings",
                )
              }
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <Settings
                size={17}
                className="text-emerald-400"
              />

              Settings
            </button>

            <div className="my-2 border-t border-emerald-400/10" />

            <button
              type="button"
              onClick={() =>
                void handleLogout()
              }
              disabled={
                loggingOut
              }
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm text-red-300 transition hover:bg-red-400/[0.06] disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <LogOut
                  size={17}
                />
              )}

              {loggingOut
                ? "Logging out..."
                : "Log Out"}
            </button>
          </div>
        )}
      </header>

      {openPanel && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={
            closePanels
          }
          className="fixed inset-0 z-40 cursor-default bg-transparent"
        />
      )}
    </>
  );
}