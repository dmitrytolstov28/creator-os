"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import Link from "next/link";

import {
  Link2,
  Loader2,
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

import {
  useAuth,
} from "@/components/auth/AuthProvider";

import {
  supabase,
} from "@/lib/supabase";

import {
  getInterfacePreferences,
  PREFERENCES_UPDATED_EVENT,
} from "@/lib/preferences";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const {
    user,
    loading,
  } = useAuth();

  const [
    checkingInstagram,
    setCheckingInstagram,
  ] = useState(true);

  const [
    hasInstagram,
    setHasInstagram,
  ] = useState(false);

  useEffect(() => {
    if (
      !loading &&
      !user
    ) {
      router.replace(
        "/auth",
      );
    }
  }, [
    loading,
    user,
    router,
  ]);

  /*
   * Approved CreatorOS 90% application scale.
   */

  useEffect(() => {
    if (
      loading ||
      !user
    ) {
      return;
    }

    const previousZoom =
      document.documentElement.style.zoom;

    document.documentElement.style.zoom =
      "0.9";

    return () => {
      document.documentElement.style.zoom =
        previousZoom;
    };
  }, [
    loading,
    user,
  ]);

  /*
   * Global CreatorOS interface preferences.
   *
   * Settings are stored in localStorage,
   * but AppShell owns applying them to the
   * application.
   *
   * This means they continue working after:
   *
   * - navigation
   * - refresh
   * - opening another CreatorOS page
   */

  useEffect(() => {
    if (
      loading ||
      !user
    ) {
      return;
    }

    function applyInterfacePreferences() {
      const preferences =
        getInterfacePreferences();

      const root =
        document.documentElement;

      root.dataset.creatorosMotion =
        preferences.reducedMotion
          ? "reduced"
          : "full";

      root.dataset.creatorosContrast =
        preferences.enhancedContrast
          ? "enhanced"
          : "standard";

      root.dataset.creatorosGlow =
        preferences.ambientGlow
          ? "on"
          : "off";

      let style =
        document.getElementById(
          "creatoros-global-interface-preferences",
        ) as HTMLStyleElement | null;

      if (!style) {
        style =
          document.createElement(
            "style",
          );

        style.id =
          "creatoros-global-interface-preferences";

        document.head.appendChild(
          style,
        );
      }

      style.textContent = `
        /*
         * REDUCED MOTION
         */

        html[data-creatoros-motion="reduced"] *,
        html[data-creatoros-motion="reduced"] *::before,
        html[data-creatoros-motion="reduced"] *::after {
          animation-duration: 0.01ms !important;
          animation-delay: 0ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0ms !important;
          scroll-behavior: auto !important;
        }

        /*
         * ENHANCED CONTRAST
         */

        html[data-creatoros-contrast="enhanced"] .text-zinc-600 {
          color: rgb(161 161 170) !important;
        }

        html[data-creatoros-contrast="enhanced"] .text-zinc-500 {
          color: rgb(190 190 200) !important;
        }

        html[data-creatoros-contrast="enhanced"] .text-zinc-400 {
          color: rgb(228 228 231) !important;
        }

        html[data-creatoros-contrast="enhanced"] .placeholder\\:text-zinc-700::placeholder {
          color: rgb(161 161 170) !important;
        }

        html[data-creatoros-contrast="enhanced"] .border-white\\/10 {
          border-color: rgb(255 255 255 / 0.16) !important;
        }

        /*
         * AMBIENT GLOW
         *
         * Only decorative glow effects are
         * targeted. Normal card/dropdown
         * shadows are intentionally preserved.
         */

        html[data-creatoros-glow="off"] .blur-3xl {
          opacity: 0 !important;
        }

        html[data-creatoros-glow="off"] [class*="shadow-[0_0_"][class*="rgba(0,255,136"] {
          box-shadow: none !important;
        }

        html[data-creatoros-glow="off"] [class*="shadow-[0_0_"][class*="rgba(52,211,153"] {
          box-shadow: none !important;
        }
      `;
    }

    function handlePreferencesUpdated() {
      applyInterfacePreferences();
    }

    function handleStorageChange(
      event: StorageEvent,
    ) {
      if (
        event.key ===
          "creatoros-interface-preferences" ||
        event.key === null
      ) {
        applyInterfacePreferences();
      }
    }

    applyInterfacePreferences();

    window.addEventListener(
      PREFERENCES_UPDATED_EVENT,
      handlePreferencesUpdated,
    );

    window.addEventListener(
      "storage",
      handleStorageChange,
    );

    return () => {
      window.removeEventListener(
        PREFERENCES_UPDATED_EVENT,
        handlePreferencesUpdated,
      );

      window.removeEventListener(
        "storage",
        handleStorageChange,
      );
    };
  }, [
    loading,
    user,
  ]);

  /*
   * Instagram connection guard.
   */

  useEffect(() => {
    if (
      loading ||
      !user
    ) {
      return;
    }

    async function checkInstagramConnection() {
      try {
        setCheckingInstagram(
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
            .select("id")
            .limit(1)
            .maybeSingle();

        if (error) {
          console.error(
            "INSTAGRAM CONNECTION CHECK ERROR:",
            error,
          );

          setHasInstagram(
            false,
          );

          return;
        }

        setHasInstagram(
          Boolean(data),
        );
      } finally {
        setCheckingInstagram(
          false,
        );
      }
    }

    void checkInstagramConnection();
  }, [
    loading,
    user,
    pathname,
  ]);

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-transparent
          text-white
        "
      >
        <div className="text-center">
          <Loader2
            size={28}
            className="
              mx-auto
              animate-spin
              text-emerald-400
            "
          />

          <p className="mt-3 text-sm text-zinc-500">
            Loading CreatorOS...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main
        className="
          min-h-screen
          bg-transparent
        "
      />
    );
  }

  const isSettingsPage =
    pathname === "/settings" ||
    pathname.startsWith(
      "/settings/",
    );

  const showInstagramModal =
    !checkingInstagram &&
    !hasInstagram &&
    !isSettingsPage;

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        overflow-hidden
        bg-transparent
        text-white
      "
    >
      {/* Ambient System Glow */}

      <div
        className="
          pointer-events-none
          fixed
          left-56
          top-0
          h-96
          w-96
          rounded-full
          bg-emerald-400/5
          blur-3xl
        "
      />

      {/* Sidebar */}

      <aside
        style={{
          height:
            "111.111vh",
        }}
        className="
          fixed
          left-0
          top-0
          z-40
          w-56
          border-r
          border-emerald-400/20
          bg-[#020604]/70
          backdrop-blur-xl
          shadow-[0_0_40px_rgba(0,255,136,0.08)]
        "
      >
        <Sidebar />
      </aside>

      {/* Main Area */}

      <div
        className="
          ml-56
          flex
          min-w-0
          flex-1
          flex-col
        "
      >
        <Topbar />

        <div
          className="
            flex-1
            overflow-y-auto
            px-6
            py-7
          "
        >
          {children}
        </div>
      </div>

      {/* Instagram Required Modal */}

      {showInstagramModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/70
            px-6
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-emerald-400/25
              bg-[#050807]/95
              p-7
              text-center
              shadow-[0_0_60px_rgba(0,255,136,0.12)]
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-emerald-400/30
                bg-emerald-400/10
              "
            >
              <Link2
                size={24}
                className="text-emerald-400"
              />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white">
              Connect Instagram
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              CreatorOS needs your
              Instagram account before
              it can analyze your
              videos, performance,
              analytics, content
              patterns and AI insights.
            </p>

            <Link
              href="/settings"
              className="
                mt-6
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-emerald-400
                px-5
                py-3
                text-sm
                font-semibold
                text-black
                transition
                hover:bg-emerald-300
              "
            >
              <Link2
                size={17}
              />

              Connect Instagram
            </Link>

            <p className="mt-4 text-xs leading-5 text-zinc-600">
              Once connected, sync your
              account and CreatorOS will
              populate your data
              automatically.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}