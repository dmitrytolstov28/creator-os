"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
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
        className="
          fixed
          left-0
          top-0
          z-40
          h-screen
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
        {/* Topbar */}

        <Topbar />

        {/* Page Content */}

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
    </main>
  );
}