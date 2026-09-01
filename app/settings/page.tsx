"use client";

import {
  useEffect,
  useState,
} from "react";

import AppShell from "../../components/layout/AppShell";

import {
  supabase,
} from "@/lib/supabase";

import {
  toast,
} from "sonner";

import {
  Bell,
  CheckCircle2,
  Cpu,
  Database,
  Link as LinkIcon,
  Mail,
  Palette,
  RefreshCw,
  RotateCcw,
  Save,
  Shield,
  SlidersHorizontal,
  User,
  X,
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

const remainingSystems = [
  {
    title:
      "Notification Center",
    description:
      "Control alerts and system updates.",
    icon:
      Bell,
    status:
      "Signal Manager",
  },

  {
    title:
      "Security Layer",
    description:
      "Manage account protection settings.",
    icon:
      Shield,
    status:
      "Protection Core",
  },

  {
    title:
      "Data Management",
    description:
      "Control connected creator data.",
    icon:
      Database,
    status:
      "Data Infrastructure",
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
  ] =
    useState(true);

  const [
    syncingInstagram,
    setSyncingInstagram,
  ] =
    useState(false);

  const [
    connectingInstagram,
    setConnectingInstagram,
  ] =
    useState(false);

  const [
    instagramError,
    setInstagramError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    profileOpen,
    setProfileOpen,
  ] =
    useState(false);

  const [
    creatorEmail,
    setCreatorEmail,
  ] =
    useState("");

  const [
    displayName,
    setDisplayName,
  ] =
    useState("");

  const [
    savingProfile,
    setSavingProfile,
  ] =
    useState(false);

  const [
    interfaceOpen,
    setInterfaceOpen,
  ] =
    useState(false);

  const [
    reducedMotion,
    setReducedMotion,
  ] =
    useState(false);

  const [
    enhancedContrast,
    setEnhancedContrast,
  ] =
    useState(false);

  const [
    ambientGlow,
    setAmbientGlow,
  ] =
    useState(true);

  useEffect(() => {
    void loadInstagramConnection();
    void loadCreatorProfile();

    loadInterfacePreferences();
  }, []);

  function applyInterfacePreferences(
    nextReducedMotion: boolean,
    nextEnhancedContrast: boolean,
    nextAmbientGlow: boolean,
  ) {
    const root =
      document.documentElement;

    root.dataset.creatorosMotion =
      nextReducedMotion
        ? "reduced"
        : "full";

    root.dataset.creatorosContrast =
      nextEnhancedContrast
        ? "enhanced"
        : "standard";

    root.dataset.creatorosGlow =
      nextAmbientGlow
        ? "on"
        : "off";

    let style =
      document.getElementById(
        "creatoros-interface-preferences",
      ) as HTMLStyleElement | null;

    if (!style) {
      style =
        document.createElement(
          "style",
        );

      style.id =
        "creatoros-interface-preferences";

      document.head.appendChild(
        style,
      );
    }

    style.textContent = `
      html[data-creatoros-motion="reduced"] *,
      html[data-creatoros-motion="reduced"] *::before,
      html[data-creatoros-motion="reduced"] *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }

      html[data-creatoros-contrast="enhanced"] .text-zinc-600 {
        color: rgb(161 161 170) !important;
      }

      html[data-creatoros-contrast="enhanced"] .text-zinc-500 {
        color: rgb(180 180 190) !important;
      }

      html[data-creatoros-contrast="enhanced"] .text-zinc-400 {
        color: rgb(212 212 216) !important;
      }

      html[data-creatoros-glow="off"] [class*="shadow-"] {
        box-shadow: none !important;
      }
    `;
  }

  function loadInterfacePreferences() {
    try {
      const stored =
        window.localStorage.getItem(
          "creatoros-interface-preferences",
        );

      if (!stored) {
        applyInterfacePreferences(
          false,
          false,
          true,
        );

        return;
      }

      const parsed =
        JSON.parse(
          stored,
        ) as {
          reducedMotion?: boolean;
          enhancedContrast?: boolean;
          ambientGlow?: boolean;
        };

      const nextReducedMotion =
        Boolean(
          parsed.reducedMotion,
        );

      const nextEnhancedContrast =
        Boolean(
          parsed.enhancedContrast,
        );

      const nextAmbientGlow =
        parsed.ambientGlow !==
        false;

      setReducedMotion(
        nextReducedMotion,
      );

      setEnhancedContrast(
        nextEnhancedContrast,
      );

      setAmbientGlow(
        nextAmbientGlow,
      );

      applyInterfacePreferences(
        nextReducedMotion,
        nextEnhancedContrast,
        nextAmbientGlow,
      );
    } catch (error) {
      console.error(
        "Failed to load interface preferences:",
        error,
      );
    }
  }

  function saveInterfacePreferences() {
    try {
      const preferences = {
        reducedMotion,
        enhancedContrast,
        ambientGlow,
      };

      window.localStorage.setItem(
        "creatoros-interface-preferences",
        JSON.stringify(
          preferences,
        ),
      );

      applyInterfacePreferences(
        reducedMotion,
        enhancedContrast,
        ambientGlow,
      );

      toast.success(
        "Interface settings saved",
      );

      setInterfaceOpen(
        false,
      );
    } catch (error) {
      console.error(
        "Failed to save interface preferences:",
        error,
      );

      toast.error(
        "Could not save interface settings",
      );
    }
  }

  function resetInterfacePreferences() {
    setReducedMotion(
      false,
    );

    setEnhancedContrast(
      false,
    );

    setAmbientGlow(
      true,
    );

    window.localStorage.removeItem(
      "creatoros-interface-preferences",
    );

    applyInterfacePreferences(
      false,
      false,
      true,
    );

    toast.success(
      "Interface settings reset",
    );
  }

  async function loadCreatorProfile() {
    try {
      const {
        data,
        error,
      } =
        await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      const user =
        data.user;

      if (!user) {
        return;
      }

      setCreatorEmail(
        user.email || "",
      );

      const metadataName =
        typeof user.user_metadata
          ?.display_name ===
        "string"
          ? user.user_metadata
              .display_name
          : "";

      setDisplayName(
        metadataName,
      );
    } catch (error) {
      console.error(
        "Failed to load creator profile:",
        error,
      );
    }
  }

  async function saveCreatorProfile() {
    if (savingProfile) {
      return;
    }

    try {
      setSavingProfile(
        true,
      );

      const trimmedName =
        displayName.trim();

      const {
        error,
      } =
        await supabase.auth.updateUser(
          {
            data: {
              display_name:
                trimmedName,
            },
          },
        );

      if (error) {
        throw error;
      }

      setDisplayName(
        trimmedName,
      );

      toast.success(
        "Creator profile updated",
      );

      setProfileOpen(
        false,
      );
    } catch (error) {
      console.error(
        "Failed to save creator profile:",
        error,
      );

      toast.error(
        "Could not update profile",
        {
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
        },
      );
    } finally {
      setSavingProfile(
        false,
      );
    }
  }

  async function loadInstagramConnection() {
    try {
      setLoadingInstagram(
        true,
      );

      setInstagramError(
        null,
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
            `
            id,
            instagram_user_id,
            username,
            created_at
            `,
          )
          .order(
            "created_at",
            {
              ascending:
                false,
            },
          )
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
      setLoadingInstagram(
        false,
      );
    }
  }

  async function connectInstagram() {
    if (
      connectingInstagram
    ) {
      return;
    }

    try {
      setConnectingInstagram(
        true,
      );

      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          "Unable to verify your login session.",
        );
      }

      const accessToken =
        sessionData.session
          ?.access_token;

      if (!accessToken) {
        throw new Error(
          "Your session has expired. Please log in again.",
        );
      }

      const response =
        await fetch(
          "/api/auth/instagram",
          {
            method:
              "POST",

            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          },
        );

      const data =
        (await response.json()) as {
          authUrl?: string;
          error?: string;
        };

      if (
        !response.ok ||
        !data.authUrl
      ) {
        throw new Error(
          data.error ||
            "Unable to start Instagram connection.",
        );
      }

      window.location.href =
        data.authUrl;
    } catch (error) {
      console.error(
        "Instagram connection failed:",
        error,
      );

      toast.error(
        "Instagram connection failed",
        {
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
        },
      );
    } finally {
      setConnectingInstagram(
        false,
      );
    }
  }

  async function syncInstagram() {
    if (
      syncingInstagram
    ) {
      return;
    }

    try {
      setSyncingInstagram(
        true,
      );

      toast.loading(
        "Syncing Instagram...",
        {
          id:
            "instagram-sync",
        },
      );

      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          "Unable to verify your login session.",
        );
      }

      const accessToken =
        sessionData.session
          ?.access_token;

      if (!accessToken) {
        throw new Error(
          "Your session has expired. Please log in again.",
        );
      }

      const response =
        await fetch(
          "/api/instagram/sync",
          {
            method:
              "POST",

            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
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
          id:
            "instagram-sync",

          description:
            `${data.inserted ?? 0} new · ${data.updated ?? 0} updated`,
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
          id:
            "instagram-sync",

          description:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
        },
      );
    } finally {
      setSyncingInstagram(
        false,
      );
    }
  }

  return (
    <AppShell>
      <div className="space-y-10">
        <div>
          <div className="flex items-center gap-2">
            <Cpu
              size={18}
              className="text-emerald-400"
            />

            <p className="text-xs uppercase tracking-[0.35em] text-emerald-400/70">
              System Settings
            </p>
          </div>

          <h1 className="mt-4 text-5xl font-bold text-white">
            Settings
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your CreatorOS
            preferences and account
            settings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* Instagram */}

          <div className="group relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-6 backdrop-blur-xl transition-all hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(0,255,136,0.12)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 opacity-0 blur-3xl transition group-hover:opacity-100" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                <InstagramIcon
                  size={24}
                />
              </div>

              <h2 className="mt-6 text-xl font-semibold text-white">
                Instagram Integration
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Connect your Creator
                account and sync Reels
                analytics automatically.
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-emerald-400/10 pt-4">
                <span className="text-xs uppercase tracking-wider text-zinc-500">
                  Social Data Layer
                </span>

                {loadingInstagram ? (
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <RefreshCw
                      size={13}
                      className="animate-spin"
                    />

                    Checking
                  </div>
                ) : instagramConnection ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

                    Connected
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-yellow-400">
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />

                    Not Connected
                  </div>
                )}
              </div>

              {instagramConnection && (
                <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                      <CheckCircle2
                        size={18}
                      />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Connected Account
                      </p>

                      <p className="mt-1 font-semibold text-white">
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
                <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300">
                  {
                    instagramError
                  }
                </div>
              )}

              {instagramConnection ? (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={
                      syncInstagram
                    }
                    disabled={
                      syncingInstagram
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
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

                  <button
                    type="button"
                    onClick={
                      connectInstagram
                    }
                    disabled={
                      connectingInstagram
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] px-4 py-3 font-semibold text-emerald-300 transition hover:border-emerald-400/60 hover:bg-emerald-400/[0.1] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LinkIcon
                      size={18}
                    />

                    {connectingInstagram
                      ? "Connecting..."
                      : "Reconnect"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={
                    connectInstagram
                  }
                  disabled={
                    connectingInstagram
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LinkIcon
                    size={18}
                  />

                  {connectingInstagram
                    ? "Connecting..."
                    : "Connect Instagram"}
                </button>
              )}
            </div>
          </div>

          {/* Creator Profile */}

          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                true,
              )
            }
            className="group relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-6 text-left backdrop-blur-xl transition-all hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(0,255,136,0.12)]"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 opacity-0 blur-3xl transition group-hover:opacity-100" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10">
                <User
                  size={24}
                  className="text-emerald-400"
                />
              </div>

              <h2 className="mt-6 text-xl font-semibold text-white">
                Creator Profile
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Manage creator identity
                and account information.
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-emerald-400/10 pt-4">
                <span className="text-xs uppercase tracking-wider text-zinc-500">
                  Identity Layer
                </span>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />

                  Manage
                </div>
              </div>
            </div>
          </button>

          {/* Interface Settings */}

          <button
            type="button"
            onClick={() =>
              setInterfaceOpen(
                true,
              )
            }
            className="group relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-6 text-left backdrop-blur-xl transition-all hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(0,255,136,0.12)]"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 opacity-0 blur-3xl transition group-hover:opacity-100" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10">
                <Palette
                  size={24}
                  className="text-emerald-400"
                />
              </div>

              <h2 className="mt-6 text-xl font-semibold text-white">
                Interface Settings
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Customize your CreatorOS
                environment.
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-emerald-400/10 pt-4">
                <span className="text-xs uppercase tracking-wider text-zinc-500">
                  Visual Engine
                </span>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <SlidersHorizontal
                    size={13}
                  />

                  Manage
                </div>
              </div>
            </div>
          </button>

          {/* Remaining Settings */}

          {remainingSystems.map(
            (system) => {
              const Icon =
                system.icon;

              return (
                <div
                  key={
                    system.title
                  }
                  className="group relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-6 backdrop-blur-xl transition-all hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(0,255,136,0.12)]"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 opacity-0 blur-3xl transition group-hover:opacity-100" />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10">
                      <Icon
                        size={24}
                        className="text-emerald-400"
                      />
                    </div>

                    <h2 className="mt-6 text-xl font-semibold text-white">
                      {
                        system.title
                      }
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                      {
                        system.description
                      }
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-emerald-400/10 pt-4">
                      <span className="text-xs uppercase tracking-wider text-zinc-500">
                        {
                          system.status
                        }
                      </span>

                      <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />

                        Online
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Interface Settings Modal */}

      {interfaceOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-emerald-400/20 bg-[#050807] p-6 shadow-[0_0_60px_rgba(0,255,136,0.12)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Palette
                    size={17}
                    className="text-emerald-400"
                  />

                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">
                    Interface Settings
                  </p>
                </div>

                <h2 className="mt-3 text-2xl font-bold text-white">
                  Visual Preferences
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Control how CreatorOS
                  looks and feels on this
                  device.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setInterfaceOpen(
                    false,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-500 transition hover:border-white/20 hover:text-white"
              >
                <X
                  size={17}
                />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() =>
                  setReducedMotion(
                    !reducedMotion,
                  )
                }
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-emerald-400/25"
              >
                <div className="pr-6">
                  <p className="text-sm font-semibold text-white">
                    Reduced Motion
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Minimize animations
                    and transitions
                    throughout CreatorOS.
                  </p>
                </div>

                <div
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    reducedMotion
                      ? "bg-emerald-400"
                      : "bg-zinc-800"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      reducedMotion
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setEnhancedContrast(
                    !enhancedContrast,
                  )
                }
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-emerald-400/25"
              >
                <div className="pr-6">
                  <p className="text-sm font-semibold text-white">
                    Enhanced Contrast
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Brighten secondary
                    text for easier
                    reading.
                  </p>
                </div>

                <div
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    enhancedContrast
                      ? "bg-emerald-400"
                      : "bg-zinc-800"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      enhancedContrast
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setAmbientGlow(
                    !ambientGlow,
                  )
                }
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-emerald-400/25"
              >
                <div className="pr-6">
                  <p className="text-sm font-semibold text-white">
                    Ambient Glow
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Keep CreatorOS glow
                    and highlight effects
                    enabled.
                  </p>
                </div>

                <div
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    ambientGlow
                      ? "bg-emerald-400"
                      : "bg-zinc-800"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      ambientGlow
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </div>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={
                  resetInterfacePreferences
                }
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                <RotateCcw
                  size={15}
                />

                Reset
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setInterfaceOpen(
                      false,
                    )
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    saveInterfacePreferences
                  }
                  className="flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-300"
                >
                  <Save
                    size={16}
                  />

                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creator Profile Modal */}

      {profileOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-emerald-400/20 bg-[#050807] p-6 shadow-[0_0_60px_rgba(0,255,136,0.12)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <User
                    size={17}
                    className="text-emerald-400"
                  />

                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">
                    Creator Profile
                  </p>
                </div>

                <h2 className="mt-3 text-2xl font-bold text-white">
                  Account Information
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Manage the identity
                  shown inside CreatorOS.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    false,
                  )
                }
                disabled={
                  savingProfile
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-500 transition hover:border-white/20 hover:text-white disabled:opacity-50"
              >
                <X
                  size={17}
                />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400">
                  Display Name
                </label>

                <div className="relative mt-2">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    type="text"
                    value={
                      displayName
                    }
                    onChange={(
                      event,
                    ) =>
                      setDisplayName(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Your name"
                    disabled={
                      savingProfile
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-400/40 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400">
                  Email
                </label>

                <div className="relative mt-2">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    type="email"
                    value={
                      creatorEmail
                    }
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-zinc-500 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-zinc-600">
                  This is the email used
                  to log in to your
                  CreatorOS account.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    false,
                  )
                }
                disabled={
                  savingProfile
                }
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void saveCreatorProfile()
                }
                disabled={
                  savingProfile
                }
                className="flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingProfile ? (
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Save
                    size={16}
                  />
                )}

                {savingProfile
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}